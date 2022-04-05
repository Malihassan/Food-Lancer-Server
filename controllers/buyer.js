const AppError = require("../helpers/ErrorClass");
const buyerModel = require("../models/buyer");
const OrderModel = require("../models/order");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const config = require("../config/emailsConfig");
const cloudinary = require("../config/cloudinaryConfig");
const mongoose = require("mongoose");

const login = async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return next(new AppError("allFieldsRequired"));
	}
	const buyer = await buyerModel.findOne({ email });
	if (!buyer) {
		return next(new AppError("InvalidPassword"));
	}
	if (!(await buyer.comparePassword(password))) {
		return next(new AppError("InvalidPassword"));
	}
	const token = await _tokenCreator(buyer.userName, buyer.id);
	await buyerModel.findByIdAndUpdate(buyer.id, token);
	res.json({ token });
};
const _tokenCreator = async function (userName, _id) {
	token = await jwt.sign({ userName, id: _id }, process.env.SECRETKEY, {
		expiresIn: "1d",
	});
	await buyerModel.findOneAndUpdate({ _id }, { token });
	return token;
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
	console.log(req.body);

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
module.exports = {
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
};
