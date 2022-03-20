const AppError = require("../helpers/ErrorClass");
const buyerModel = require("../models/buyer");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function CountOfBuyerModules() {
	return await buyerModel.count({});
}
const login= async (req,res,next)=>{
  const {email,password}=req.body;
  if (!email||!password)
  {
    return next(new AppError("allFieldsRequired"));
  }
  const buyer=await buyerModel.findOne({email});
  if (!buyer)
  {
    return next(new AppError("emailNotFound"));
  }
  if(! await buyer.comparePassword(password))
  {
    return next(new AppError("InvalidPassword"));
  }
  const token = await _tokenCreator(buyer.userName, buyer.id);
  await buyerModel.findByIdAndUpdate(buyer.id,token);
  res.json({token});
}
const _tokenCreator = async function (userName, _id) {
  token = await jwt.sign({ userName, id: _id }, process.env.SECRETKEY, {
    expiresIn: "1d",
  });
  await buyerModel.findOneAndUpdate({ _id }, { token });
  return token;
};
const signup = async (req, res, next) => {
	try {
		await buyerModel.create(req.body);
		res.status(201).send("created");
	} catch (error) {
		res.status(400).send(error.message);
	}
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
	const { id } = req.params;
	const buyer = await buyerModel
		.findById(id)
		.populate({ path: "fav", select: "name" })
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
const getOrdersForSpecifcBuyer = (req, res, next) => {
	const { id } = req.params;
	orderModel
		.find({ buyerId: id })
		.populate({
			path: "sellerId",
			select: "userName firstName lastName phone email status gender -_id",
		})
		.populate({
			path: "products",
			populate: {
				path: "_id",
				select:
					"name description image price addOns reviews avgRate status -_id",
			},
		})
		.then((data) => {
			if (!data) {
				return next(new AppError("accountNotFound"));
			}
			res.json(data);
		});
};

async function updateBuyer(req, res, next) {
	const { id } = req.buyer;
	const { phone, firstName, lastName, address, image } = req.body;
	buyerModel
		.findOneAndUpdate(
			{ _id: id },
			{ phone, firstName, lastName, address, image },
			{ new: true, runValidators: true }
		)
		.then((data) => {
			if (!data) {
				return next(new AppError("allFieldsRequired"));
			}
			res.send("Profile Updated Successfully");
		})
		.catch((e) => res.status(400).json(e.message));
}

module.exports = {
  login,
	signup,
	updateStatus,
	allBuyers,
	buyerById,
	getOrdersForSpecifcBuyer,
	updateBuyer,
};
