const { config } = require("../config/cloudinaryConfig");
const AppError = require("../helpers/ErrorClass");
const buyerModel = require("../models/buyer");
const OrderModel = require("../models/order");
const signup = async (req, res, next) => {
  try {
    await buyerModel.create(req.body);
    res.status(201).send("created");
  } catch (error) {
    res.status(400).send(error.message);
  }
};
async function forgetPassword(req, res, next) {
  const { email } = req.body;
  const buyer = await buyerModel.findOne({ email });
  if (!buyer) {
    return next(new AppError("emailNotFound"));
  }
  const token = await _tokenCreator(buyer.userName, buyer.id);
  config.forgetPassword(seller.userName, seller.email, token);
  res.status(200).json({ response: "Success send code" });
}
const resetPassword = async (req, res, next) => {
  const buyer = req.buyer;
  console.log(buyer.email,buyer.id);
  const { password, confirmPassword } = req.body;
  if (password != confirmPassword) {
    return next({ status: 404, message: "Password Not Matched" });
  }
  buyer.password =password
  await buyer.save();
  res.json({message:'Success'});
};

const allBuyers = async (req, res, next) => {
  let { page = 1, status , email  } = req.query;
  status = status ? { status } : {};
  email = email ? { email } : {};
  const pageSize = 7;
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
const getOrdersForSpecifcBuyer =async (req, res, next) => {
  const { id } = req.params;
  await OrderModel
    .find({ buyerId: id })
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
      countofOrderBuyer(id)
      countOfDoneOrderBuyer(id)
      countofCancelOrderBuyer(id)
      res.json(data);
    })
};
async function countofOrderBuyer(id) {
  const count  =await OrderModel.find({buyerId:id}).count()
  console.log(count);
}
async function countofCancelOrderBuyer(id) {
  const count  =await OrderModel.find({buyerId:id,status:'canceled'}).count()
  console.log(count);
}
async function countOfDoneOrderBuyer(id) {
  const count  =await OrderModel.find({buyerId:id,status:'delivered'}).count()
  console.log(count);
}
module.exports = {
  signup,
  forgetPassword,
  resetPassword,
  updateStatus,
  allBuyers,
  buyerById,
  getOrdersForSpecifcBuyer,
};
