const AppError = require("../helpers/ErrorClass");
const sellerModel = require("../models/seller");
const config = require("../config/emailsConfig");
const orderModel = require("../models/order");
const productModel = require("../models/product");
const cloudinary = require("../config/cloudinaryConfig");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function login(req, res, next) {
  const { email, password } = req.body;
  if (!validatorLoginRequestBody(email, password)) {
    return next(new AppError("allFieldsRequired"));
  }
  
  const user = await sellerModel.findOne({ email });
  if (!user) return next(new AppError("InvalidPassword"));
  const validPass = await user.comparePassword(password);
  if (!validPass) return next(new AppError("InvalidPassword"));

	const token = await _tokenCreator(user.userName, user.id);
	// save new token
	sellerModel.findByIdAndUpdate(user.id, token);
	res.json({ token });
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
	res.status(200).json({ response: "Success send code" });
}
const resetPassword = async (req, res, next) => {
	const seller = req.seller;
	console.log(seller.email, seller.id);
	const { password, confirmPassword } = req.body;
	if (password != confirmPassword) {
		return next({ status: 404, message: "Password Not Matched" });
	}
	seller.password = password;
	await seller.save();
	res.json({ message: "Success" });
};

async function updateSeller(req, res, next) {
	const { id } = req.seller;
	const { phone, firstName, lastName, coverageArea } = req.body;

	sellerModel
		.findOneAndUpdate(
			{ _id: id },
			{ phone, firstName, lastName, coverageArea },
			{ returnNewDocument: true, runValidators: true, new: true }
		)
		.then((data) => {
			if (!data) {
				return next(new AppError("allFieldsRequired"));
			}

			res.send("Profile Updated Successfully");
		})
		.catch((e) => res.status(400).json(e.message));
}

const signup = function (req, res, next) {
	const userDetails = req.body;
	// const result = await cloudinary.uploader.upload(req.file.path);
	_create({
		// image: [{ url: result.secure_url, _id: result.public_id }],
		...userDetails,
	})
		.then((data) => {
			res.json(data);
		})
		.catch((e) => {
			console.log(e.message);
			res.status(404).json(e.message);
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
			res.send(`hello ${user}`);
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
	console.log(id, status);
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
const getSpecificSeller = async (req, res, next) => {
	let { id } = req.params;
	!id ? (id = req.seller._id) : "";

	const seller = await sellerModel.findById(id).populate("coverageArea");

	if (!seller) {
		return next(new AppError("accountNotFound"));
	}

	res.json(seller);
};
const getSellers = async (req, res, next) => {
	let { page = 1, status, email, rate } = req.query;
	status = status ? { status } : {};
	email = email ? { email } : {};
	rate = rate ? { rate } : [];
	if (rate.length !== 0) {
		rate = rate.map((item, index) => {
			console.log("===>", item);
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
};

const getSellersByStatus = async (req, res, next) => {
	const { status } = req.params;
	const data = await sellerModel.find({ status });
	if (data.length === 0) {
		return next(new AppError("noSellerFound"));
	}
	res.json(data);
};


module.exports = {
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
};
