const AppError = require("../helpers/ErrorClass");
const buyerModel = require("../models/buyer");
const OrderModel = require("../models/order");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const config = require("../config/emailsConfig");
const cloudinary = require("../config/cloudinaryConfig");

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("allFieldsRequired"));
  }
  const buyer = await buyerModel.findOne({ email });
  if (!buyer) {
    return next(new AppError("emailNotFound"));
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
      res.json(data);
    })
    .catch((e) => res.status(400).send(e.message));
};
async function forgetPassword(req, res, next) {
  const { email } = req.body;
  console.log(email);
  const buyer = await buyerModel.findOne({ email });
  console.log(buyer);

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
  await buyer.save();
  res.json({ message: "Success" });
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
      if (data.length == 0) {
        return next(new AppError("accountNotFound"));
      }
      countofOrderBuyer(id);
      countOfDoneOrderBuyer(id);
      countofCancelOrderBuyer(id);
      res.json(data);
    });
};
async function countofOrderBuyer(id) {
  const count = await OrderModel.find({ buyerId: id }).count();
  console.log(count);
}
async function countofCancelOrderBuyer(id) {
  const count = await OrderModel.find({
    buyerId: id,
    status: "canceled",
  }).count();
  console.log(count);
}
async function countOfDoneOrderBuyer(id) {
  const count = await OrderModel.find({
    buyerId: id,
    status: "delivered",
  }).count();
  console.log(count);
}
async function updateBuyer(req, res, next) {
  const { _id } = req.buyer;
  let result;
  try{
    console.log("uplaod");
    result = await cloudinary.uploader.upload(req.file.path);
    console.log(result);
  }
  catch(err){
    console.log(err.message,"Message");
    return next(new AppError("allFieldsRequired"));

  }
  const { phone, firstName, lastName, address } = req.body;
  buyerModel
    .findOneAndUpdate(
      { _id },
      {
        phone,
        firstName,
        lastName,
        address,
        image: { url: result.secure_url, _id: result.public_id },
      },
      { new: true, runValidators: true }
    )
    .then((data) => {
      if (!data) {
        return next(new AppError("allFieldsRequired"));
      }
      console.log("Valid");
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
};
