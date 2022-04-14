const AppError = require("../helpers/ErrorClass");
const buyerModel = require("../models/buyer");
const OrderModel = require("../models/order");
const productModel = require("../models/product");
const sellerModel = require("../models/seller");
const orderModel = require("../models/order");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const config = require("../config/emailsConfig");
const cloudinary = require("../config/cloudinaryConfig");
const mongoose = require("mongoose");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const login = async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return next(new AppError("allFieldsRequired"));
	}
	const buyer = await buyerModel.findOne({ email });
	if (!buyer) return next(new AppError("emailNotFound"));

	if (buyer.status === "pending") {
		return next(new AppError("pendindStatusEmail"));
	}
	if (!(await buyer.comparePassword(password))) {
		return next(new AppError("InvalidPassword"));
	}
	const token = await _tokenCreator(buyer.userName, buyer.id);
	await buyerModel.findByIdAndUpdate(buyer.id, token);
	res.json({ token, _id: buyer._id });
};
const _tokenCreator = async function (userName, _id) {
	token = await jwt.sign({ userName, id: _id }, process.env.SECRETKEY, {
		expiresIn: "1d",
	});
	await buyerModel.findOneAndUpdate({ _id }, { token });
	return token;
};
const confirm = function (req, res, next) {
	const { id } = req.params;
	console.log(id, "==<");
	_changeStatus(id)
		.then((user) => {
			return res.render("welcomePage", {
				userName: user,
			});
		})
		.catch((e) => {
			console.log(e);
			next();
		});
};
const _changeStatus = async function (id) {
	const user = await buyerModel.findByIdAndUpdate(id, { status: "active" });
	const { userName } = user;
	return userName;
};
const signup = async (req, res, next) => {
	const buyerData = req.body;
	const result = await cloudinary.uploader.upload(req.file.path);
	_create({
		image: { url: result.secure_url, _id: result.public_id },
		...buyerData,
	})
		.then((data) => {
			res.json({ message: "Please Cofirm Your Email" });
		})
		.catch((e) => res.status(400).send(e.message));
};
async function forgetPassword(req, res, next) {
	const { email } = req.body;
	const buyer = await buyerModel.findOne({ email });
	if (!buyer) {
		return next(new AppError("emailNotFound"));
	}
	const token = await _tokenCreator(buyer.userName, buyer.id);
	config.forgetPassword(buyer.userName, buyer.email, token, "buyer");
	res.status(200).json({ response: "Success send code" });
}
const resetPassword = async (req, res, next) => {
	const buyer = req.buyer;
	const { password, confirmPassword } = req.body;
	if (password != confirmPassword) {
		return next({ status: 404, message: "Password Not Matched" });
	}
	buyer.password = password;
	try {
		await buyer.save({
			validateModifiedOnly: true,
		});
		res.status(200).json({ response: "Reset Password Done Succefully" });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

const checkBuyerAcountBeforeSignup = async (req, res, next) => {
	const { email, userName, phone } = req.body;
	const accountExist = await buyerModel.findOne({
		$or: [{ email }, { userName }, { phone }],
	});

	if (accountExist) {
		return next(new AppError("userUniqueFileds"));
	}
	next();
};
const _create = async function (buyerData) {
	const newBuyer = await buyerModel.create(buyerData);
	const { userName, email, _id } = newBuyer;
	const token = await _tokenCreator(userName, _id);

	config._mailConfirmation(
		userName,
		email,
		token,
		_id,
		"buyer",
		process.env.USER,
		process.env.PASS
	);
	return token;
};

const allBuyers = async (req, res, next) => {
	let { page = 1, status, email } = req.query;
	status = status ? { status } : {};
	email = email ? { email } : {};
	const pageSize = 4;
	try {
		const option = {
			page: page,
			limit: pageSize,
			select: "userName email address phone status",
		};
		const allBuyers = await buyerModel.paginate(
			{ $and: [status, email] },
			option
		);
		res.json(allBuyers);
	} catch (error) {
		res.status(400).json(error.message);
	}
};

const buyerById = async (req, res, next) => {
	const { _id } = req.buyer;
	const buyer = await buyerModel
		.findById(_id)
		.populate({
			path: "favs",
		})
		.catch((error) => {
			res.status(400).json(error.message);
		});
	if (!buyer) {
		return next(new AppError("accountNotFound"));
	}
	res.json(buyer);
};

const updateStatus = async (req, res, next) => {
	const { id } = req.params;
	const { status } = req.body;
	try {
		const updated = await buyerModel.findOneAndUpdate(
			{ _id: id },
			{ status },
			{ runValidators: true, new: true }
		);
		if (!updated) {
			return next(new AppError("accountNotFound"));
		}
		res.json({ message: "updated" });
	} catch (error) {
		res.status(400).json(error.message);
	}
};
const getOrdersForSpecifcBuyer = async (req, res, next) => {
	const { id } = req.params;
	await OrderModel.find({ buyerId: id })
		.populate({
			path: "sellerId",
			select: "userName firstName lastName phone email status gender _id",
		})
		.populate({
			path: "products",
			populate: {
				path: "_id",
				select:
					"name description image price addOns reviews avgRate status _id",
			},
		})
		.then((data) => {
			res.json(data);
		});
};

const getFavs = async (req, res, next) => {
	const { _id } = req.buyer;

	const buyer = await buyerModel.findById({ _id }).populate({
		path: "favs",
	});
	if (!buyer) {
		return next(new AppError("accountNotFound"));
	}
	res.json(buyer.favs);
};

const addFav = async (req, res, next) => {
	const { _id } = req.buyer;
	const newFavId = mongoose.Types.ObjectId(req.body.id);

	const buyer = await buyerModel.findById({ _id });
	if (!buyer) {
		return next(new AppError("accountNotFound"));
	}
	const exist = await buyer.favs.find(
		(id) => id.toString() === newFavId.toString()
	);
	if (exist) {
		res.send("Product is already favoured");
	} else {
		const newFavs = [...buyer.favs, newFavId];

		const updatedBuyer = await buyerModel
			.findByIdAndUpdate(
				{ _id },
				{ favs: newFavs },
				{ returnNewDocument: true, runValidators: true, new: true }
			)
			.populate({
				path: "favs",
			});
		res.json(updatedBuyer.favs);
	}
};

const deleteFav = async (req, res, next) => {
	const { _id } = req.buyer;
	const deleteId = mongoose.Types.ObjectId(req.body.id);

	const buyer = await buyerModel.findById({ _id });
	if (!buyer) {
		return next(new AppError("accountNotFound"));
	}
	const newFavs = buyer.favs.filter((id) => {
		return id.toString() === deleteId.toString() ? false : true;
	});
	const updatedBuyer = await buyerModel
		.findByIdAndUpdate(
			{ _id },
			{ favs: newFavs },
			{ returnNewDocument: true, runValidators: true, new: true }
		)
		.populate({ path: "favs" });

	res.json(updatedBuyer.favs);
};

async function updateBuyer(req, res, next) {
	const { _id } = req.buyer;
	const { phone, firstName, lastName, address, imageId, imageUrl } = req.body;

	let result;
	let newImage = {};
	if (req.file) {
		try {
			// delete old image
			await cloudinary.uploader.destroy(imageId);
			// add new image
			result = await cloudinary.uploader.upload(req.file.path);
			newImage.url = result.secure_url;
			newImage._id = result.public_id;
		} catch (err) {
			return next(new AppError("allFieldsRequired"));
		}
	}

	buyerModel
		.findOneAndUpdate(
			{ _id },
			{
				phone,
				firstName,
				lastName,
				address,
				image: newImage.url ? newImage : { url: imageUrl, _id: imageId },
			},
			{ new: true, runValidators: true, returnNewDocument: true }
		)
		.then((data) => {
			if (!data) {
				return next(new AppError("allFieldsRequired"));
			}

			res.status(200).send("Profile Updated Successfully");
		})
		.catch((e) => res.status(400).json(e.message));
}
const logout = async (req, res, next) => {
	const buyer = req.buyer;
	await buyerModel.findOneAndUpdate(
		{ _id: buyer._id },
		{ token: "" },
		{ new: true, runValidators: true }
	);
	res.status(200).json({ Message: "logout" });
};
const addNotificationToBuyerForChangeOrderStatus = async (req, res, next) => {
	const { _id } = req.order;
	const buyerId = req.order.buyerId._id;

	await buyerModel.findOneAndUpdate(
		{ _id: buyerId, "notification.order.orderId": _id },
		{
			$set: { "notification.$.order.read": false },
		},
		{ new: true, runValidators: true }
	);

	res.json(req.order);
};
const addNotificationToBuyerForRecieveMesseageFromSeller = async (
	req,
	res,
	next
) => {
	const { buyerId, orderId } = req.body;
	const updatedBuyer = await buyerModel.findOneAndUpdate(
		{
			_id: buyerId,
			"notification.order.orderId": orderId,
		},
		{
			$inc: { "notification.$.chatMessageCount": 1 },
		},
		{ new: true, runValidators: true }
	);
	const io = req.app.get("io");
	io.to(updatedBuyer.socketId).emit(
		"receiveNotification",
		updatedBuyer.notification
	);
	res.json(updatedBuyer);
};
const setNotificationMessageAsReaded = async (req, res, next) => {
	const { orderId } = req.body;
	const buyerData = await buyerModel.findOneAndUpdate(
		{
			_id: req.buyer._id,
			"notification.order.orderId": mongoose.Types.ObjectId(orderId),
		},
		{
			$set: { "notification.$.chatMessageCount": 0 },
		},
		{ upsert: true, new: true, runValidators: true }
	);
	res.json(buyerData.notification);
};
const getNotificationsForBuyer = async (req, res, next) => {
	const buyerData = await buyerModel.findById({ _id: req.buyer._id });
	if (!buyerData) {
		return next(new AppError("accountNotFound"));
	}
	res.json(buyerData.notification);
};
const getNotification = async (req, res, next) => {
	const buyer = await buyerModel.findById(req.buyer._id);
	res.json(buyer.notification);
};
const setNotificationForOrdersAsReaded = async (req, res, next) => {
	const buyerId = req.buyer._id;
	const buyer = await buyerModel.findByIdAndUpdate(
		{ _id: buyerId },
		{
			$set: { "notification.$[].order.read": true },
		},
		{ new: true }
	);
	res.json();
};
const addNotificationToBuyer = async (req, res, next) => {
	const { orderId } = req.body;
	await buyerModel.findOneAndUpdate(
		{ _id: req.buyer._id },
		{
			$push: {
				notification: {
					"order.orderId": orderId,
					"order.read": true,
				},
			},
		},
		{ new: true, runValidators: true }
	);
	res.json(req.updatedSeller);
};

const sendToPayment = async (req, res) => {
	const queryArr = [];
	for (let item of req.body.items) {
		queryArr.push(item._id._id);
	}
	productModel.find(
		{
			_id: { $in: queryArr },
		},
		async function (err, docs) {
			if (err) {
				res.json(err);
			}
			// a way to avoid nested loop when mixing two arrays, called frequency counter
			const lockup = {};
			for (let item of req.body.items) {
				lockup[item._id._id] = item.quantity;
			}
			const orderProducts = docs.map((product) => {
				let quantity = lockup[product._id];
				product["quantity"] = quantity;
				return product;
			});

			try {
				const session = await stripe.checkout.sessions.create({
					payment_method_types: ["card"],
					mode: "payment",
					line_items: orderProducts.map((product) => {
						// console.log(product.sellerId);
						return {
							price_data: {
								currency: "EGP",
								product_data: {
									name: product.name,
								},
								unit_amount: product.price * 100, // price must be in cents
							},
							quantity: product.quantity,
						};
					}),
					metadata: {
						sellerId: orderProducts[0].sellerId.toString(),
						orderId: req.body.orderId.toString(),
					},
					success_url: `${process.env.SERVER_URL}/buyer/account/paymentSuccess`,
					cancel_url: `${process.env.SERVER_URL}/buyer/account/paymentCancel`,
				});
				res.json({ url: session.url, newRes: session });
			} catch (e) {
				res.status(500).json({ error: e.message });
			}
		}
	);
};

const paymentSuccess = (req, res) => {
	return res.render("paymentSuccess");
};
const paymentCancel = (req, res) => {
	return res.render("paymentCancel");
};

const webhook = async (request, response) => {
	const sig = request.headers["stripe-signature"];
	const endpointSecret = process.env.WEBHOOK_SECRET;

	let event;
	try {
		event = await stripe.webhooks.constructEvent(
			request.rawBody,
			sig,
			endpointSecret
		);
	} catch (err) {
		response.status(400).send(`Webhook Error: ${err.message}`);
		return;
	}

	// Handle the event
	// console.log(event.type);
	switch (event.type) {
		case "checkout.session.async_payment_failed":
			const failedSession = event.data.object;
			console.log("failedSession");
			// Then define and call a function to handle the event checkout.session.async_payment_failed
			break;
		case "checkout.session.completed":
			const succeededSession = event.data.object;

			const sellerId = mongoose.Types.ObjectId(
				event.data.object.metadata.sellerId
			);
			const orderId = mongoose.Types.ObjectId(
				event.data.object.metadata.orderId
			);

			await sellerModel.findOneAndUpdate(
				{ _id: sellerId },
				{ $inc: { balance: succeededSession.amount_total } },
				{
					new: true,
					upsert: true,
				}
			);

			const orderData = await orderModel
				.findOneAndUpdate({ _id: orderId }, { status: "in progress" })
				.populate("sellerId buyerId");
			const socketIds = [
				orderData.sellerId.socketId,
				orderData.buyerId.socketId,
			];
			const io = request.app.get("io");
			socketIds.forEach((socketId) => {
				console.log(socketId);
				io.to(socketId).emit("paymentDone", "test");
			});

			// Then define and call a function to handle the event checkout.session.async_payment_succeeded
			break;
		// case "checkout.session.expired":
		// 	const expiredSession = event.data.object;
		// 	console.log("expiredSession");
		// 	// Then define and call a function to handle the event checkout.session.expired
		// 	break;
		// case "payment_intent.succeeded":
		// 	const paymentIntent = event.data.object;
		// 	console.log("paymentIntent");
		// 	// Then define and call a function to handle the event payment_intent.succeeded
		// 	break;
		// ... handle other event types
		default:
		// console.log(`Unhandled event type ${event.type}`);
	}

	// Return a 200 response to acknowledge receipt of the event
	response.send();
};

module.exports = {
	addNotificationToBuyer,
	addNotificationToBuyerForChangeOrderStatus,
	addNotificationToBuyerForRecieveMesseageFromSeller,
	setNotificationMessageAsReaded,
	getNotificationsForBuyer,
	setNotificationForOrdersAsReaded,
	getNotification,
	login,
	signup,
	forgetPassword,
	resetPassword,
	updateBuyer,
	updateStatus,
	allBuyers,
	buyerById,
	getOrdersForSpecifcBuyer,
	getFavs,
	addFav,
	deleteFav,
	checkBuyerAcountBeforeSignup,
	confirm,
	logout,
	sendToPayment,
	paymentSuccess,
	paymentCancel,
	webhook,
};
