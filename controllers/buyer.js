const AppError = require("../helpers/ErrorClass");
const buyerModel = require("../models/buyer");

async function CountOfBuyerModules() {
  return await buyerModel.count({});
}

const signup = async (req, res, next) => {
  try {
    await buyerModel.create(req.body);
    res.status(201).send("created");
  } catch (error) {
    res.status(400).send(error.message);
  }
};
const allBuyers = async (req, res, next) => {
  let { page = 1, status , email  } = req.query;
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
  const { status } = req.body;
  const { id } = req.params;
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

module.exports = {
  signup,
  updateStatus,
  allBuyers,
  buyerById,
  getOrdersForSpecifcBuyer,
};
