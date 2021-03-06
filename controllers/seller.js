const AppError = require("../helpers/ErrorClass");
const sellerModel = require("../models/seller");
const config = require("../config/emailsConfig");
const orderModel = require("../models/order");
const productModel = require("../models/product");
var mongoose = require("mongoose");
const orderController = require("../controllers/order");
const cloudinary = require("../config/cloudinaryConfig");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const logout = async (req, res) => {
	const seller = req.seller;
	await sellerModel.findOneAndUpdate(
		{ _id: seller._id },
		{ token: "" },
		{ new: true, runValidators: true }
	);
	res.status(200).json({ Message: "logout" });
};
async function login(req, res, next) {
	const { email, password } = req.body;
	if (!validatorLoginRequestBody(email, password)) {
		return next(new AppError("allFieldsRequired"));
	}

	const user = await sellerModel.findOne({ email });
	if (!user) return next(new AppError("emailNotFound"));
	if (user.status === "pending") {
		return next(new AppError("pendindStatusEmail"));
	}
	const validPass = await user.comparePassword(password);
	if (!validPass) return next(new AppError("InvalidPassword"));
	const token = await _tokenCreator(user.userName, user.id);
	// save new token
	sellerModel.findOneAndUpdate(
		{ _id: user.id },
		{ token },
		{ new: true, runValidators: true }
	);
	//   req.token = token
	//   next()
	res.json({ token, _id: user._id });
}

function validatorLoginRequestBody(email, password) {
	if (!email || email.length == 0 || !password || password.length == 0) {
		return false;
	}
	return true;
}
async function forgetPassword(req, res, next) {
	const { email } = req.body;
	const seller = await sellerModel.findOne({ email });
	if (!seller) {
		return next(new AppError("emailNotFound"));
	}
	const token = await _tokenCreator(seller.userName, seller.id);
	config.forgetPassword(seller.userName, seller.email, token, "seller");
	res.status(200).json({ response: "Please Check Your Email" });
}
const resetPassword = async (req, res, next) => {
	const seller = req.seller;
	const { password, confirmPassword } = req.body;
	if (password != confirmPassword) {
		return next({ status: 404, message: "Password Not Matched" });
	}
	seller.password = password;
	try {
		await seller.save({
			validateModifiedOnly: true,
		});
		res.status(200).json({ response: "Reset Password Done Succefully" });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};
async function updateSeller(req, res, next) {
	const { id } = req.seller;
	const { phone, firstName, lastName, coverageArea, imageId, imageUrl } =
		req.body;

	let newImage = {};
	if (req.file) {
		try {
			// delete old image
			await cloudinary.uploader.destroy(imageId);
			// add new image
			const result = await cloudinary.uploader.upload(req.file.path);
			newImage.url = result.secure_url;
			newImage._id = result.public_id;
		} catch (err) {
			return next(new AppError("allFieldsRequired"));
		}
	}

	sellerModel
		.findOneAndUpdate(
			{ _id: id },
			{
				phone,
				firstName,
				lastName,
				coverageArea,
				image: newImage.url ? newImage : { url: imageUrl, _id: imageId },
			},
			{ returnNewDocument: true, runValidators: true, new: true }
		)
		.then((data) => {
			if (!data) {
				return next(new AppError("allFieldsRequired"));
			}

			res.status(200).send("Profile Updated Successfully");
		})
		.catch((e) => res.status(400).json(e.message));
}

const checkSellerAcountBeforeSignup = async (req, res, next) => {
	const { email, userName, phone } = req.body;
	const accountExist = await sellerModel.findOne({
		$or: [{ email }, { userName }, { phone }],
	});
	if (accountExist) {
		return next(new AppError("userUniqueFileds"));
	}
	next();
};
const signup = async function (req, res, next) {
	const userDetails = req.body;
	const result = await cloudinary.uploader.upload(req.file.path);
	console.log(result);
	_create({
		image: { url: result.secure_url, _id: result.public_id },
		...userDetails,
	})
		.then((data) => {
			res.json({ message: "Please Cofirm Your Email" });
		})
		.catch((e) => {
			res.status(400).json(e.message);
		});
};

const _create = async function (userDetails) {
	const newUser = await sellerModel.create(userDetails);
	const { userName, email, _id } = newUser;

	const token = await _tokenCreator(userName, _id);

	config._mailConfirmation(
		userName,
		email,
		token,
		_id,
		"seller",
		process.env.USER,
		process.env.PASS
	);
	return token;
};

const _tokenCreator = async function (userName, _id) {
	token = await jwt.sign({ userName, id: _id }, process.env.SECRETKEY, {
		expiresIn: "1d",
	});
	await sellerModel.findOneAndUpdate({ _id }, { token });
	return token;
};

const confirm = function (req, res, next) {
	const { id } = req.params;
	_changeStatus(id)
		.then((user) => {
			// res.send(`hello ${user}`);
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
	const user = await sellerModel.findByIdAndUpdate(id, { status: "active" });
	const { userName } = user;
	return userName;
};
const updateSellerStatus = function (req, res, next) {
	const { id } = req.params;
	const { status } = req.body;
	_editProducts(id, status);
	_editSeller(id, status)
		.then((result) => {
			res.status(200).json({ updatedStatus: result.status });
		})
		.catch(() => {
			next(new AppError("UnauthorizedError"));
		});
};
const _editSeller = function (id, status) {
	const options = { runValidators: true, new: true };
	return sellerModel.findOneAndUpdate({ _id: id }, { status }, options);
};
const _editProducts = async (id, status) => {
	if(status === "blocked"){
		await productModel.updateMany({ sellerId: id }, { status });
	} else if(status === "active"){
		await productModel.updateMany({ sellerId: id }, { status: "pending" });
	}
}
const getSpecificSeller = async (req, res, next) => {
	let { id } = req.params;
	!id ? (id = req.seller._id) : "";

	const seller = await sellerModel.findById(id).populate("coverageArea");

	if (!seller) {
		return next(new AppError("accountNotFound"));
	}

	let countDeliverOrder =
		await orderController.getCountDeliveredOrdersForSeller(seller._id);
	let countInprogressOrder =
		await orderController.getCountInprogressOrdersForSeller(seller._id);

	res.json({ seller, countDeliverOrder, countInprogressOrder });
};
const getSellers = async (req, res, next) => {
  let { page = 1, status, email, rate } = req.query;
  status = status ? { status } : {};
  email = email ? { email } : {};
  rate = typeof(rate) === "string" ? [rate]:rate
 
  if (rate) {
    rate = rate.map((item, index) => {
      switch (item) {
        case ">=2":
          return (item = { $lte: 2 });
        case "2<=4":
          return (item = { $gte: 2, $lte: 4 });
        case "4<=5":
          return (item = { $gte: 4, $lte: 5 });
      }
    });
    rate = rate.map((item) => ({ rate: item }));
  } else {
    rate = [{ rate: { $gte: 0 } }];
  }
  const pageSize = 7;
  const option = {
    page: page,
    limit: pageSize,
    populate: {
      path: "coverageArea",
      select: "governorateName regionName",
    },
    select: "userName email rate status",
  };
  const allSellers = await sellerModel.paginate(
    {
      $and: [status, email, { $or: rate }],
    },
    option
  );
  res.json(allSellers);
  // res.json();

};

const getSellersByStatus = async (req, res, next) => {
	const { status } = req.params;
	const data = await sellerModel.find({ status });
	if (data.length === 0) {
		return next(new AppError("noSellerFound"));
	}
	res.json(data);
};

const addNotificationToSellerForAddOrder = async (req, res, next) => {
	const { sellerId, orderId } = req.body;
	const updatedSeller = await sellerModel.findOneAndUpdate(
		{ _id: sellerId },
		{
			$push: {
				notification: {
					"order.orderId": mongoose.Types.ObjectId(orderId),
				},
			},
		},
		{ new: true, runValidators: true }
	);
	// res.json(updatedSeller);
	req.updatedSeller = updatedSeller;
	next();
};
const addNotificationToSellerForRecieveMesseageFromBuyer = async (
	req,
	res,
	next
) => {
	const { sellerId, orderId } = req.body;
	const updatedSeller = await sellerModel.findOneAndUpdate(
		{
			_id: sellerId,
			"notification.order.orderId": orderId,
		},
		{
			$inc: { "notification.$.chatMessageCount": 1 },
		},
		{ new: true, runValidators: true }
	);
	const io = req.app.get("io");
	io.to(updatedSeller.socketId).emit(
		"receiveNotification",
		updatedSeller.notification
	);
	res.json(updatedSeller);
};
const setNotificationOrderAsReaded = async (req, res, next) => {
	const { seller, order } = req;
	await sellerModel.findOneAndUpdate(
		{
			_id: seller._id,
			"notification.order.orderId": order._id,
		},
		{
			$set: { "notification.$.order.read": true },
		},
		{ new: true, runValidators: true }
	);
	// res.json(req.order);

	next();
};

const setMessageAsReaded = async (req, res, next) => {
	const { orderId } = req.body;
	const seller = await sellerModel.findOneAndUpdate(
		{
			_id: req.seller._id,
			"notification.order.orderId": orderId,
		},
		{
			$set: { "notification.$.chatMessageCount": 0 },
		},
		{ new: true, runValidators: true }
	);

	res.json(seller.notification);
};
const getNotification = async (req, res, next) => {
	const seller = await sellerModel.findById(req.seller._id);
	res.json(seller.notification);
};
module.exports = {
	addNotificationToSellerForAddOrder,
	addNotificationToSellerForRecieveMesseageFromBuyer,
	setNotificationOrderAsReaded,
	setMessageAsReaded,
	getNotification,
	checkSellerAcountBeforeSignup,
	signup,
	confirm,
	login,
	forgetPassword,
	resetPassword,
	getSellers,
	getSellersByStatus,
	getSpecificSeller,
	updateSeller,
	updateSellerStatus,
	logout,
};
