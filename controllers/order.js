const orderModel = require("../models/order");
const AppError = require("../helpers/ErrorClass");
const { path } = require("express/lib/application");
const { json } = require("express/lib/response");

const getOrdersForSpecificBuyer = (req, res, next) => {
  // const { id } = req.query;
//   const { id } = req.params;
const { id } = req.buyer;
  orderModel
    .find({ buyerId: id })
    .populate({
      path: "sellerId",
      select: "userName firstName lastName phone email status gender rate",
    })
    .populate({
      path: "products",
      populate: {
        path: "_id",
        select:
          "name description image price addOns reviews avgRate status ",
      },
    })
    .then((data) => {
      if (!data) {
        return next(new AppError("accountNotFound"));
      }
      res.json(data);
    });
};

const getOrders = async (req, res, next) => {
	let sellerId;
	if (req.seller) {
		sellerId = req.seller._id;
	} else {
		sellerId = req.query.sellerId;
	}
	const { minPrice, maxPrice, orderStatus, id, buyerId, page = 1 } = req.query;
	const pageSize = 6;

  const minPriceQuery = minPrice ? { totalPrice: { $gte: minPrice } } : {};
  const maxPriceQuery = maxPrice ? { totalPrice: { $lte: maxPrice } } : {};
  const orderStatusQuery = orderStatus ? { status: orderStatus } : {};
  const orderIdQuery = id ? { _id: id } : {};
  const buyerIdQuery = buyerId ? { buyerId } : {};
  const sellerIdQuery = sellerId ? { sellerId } : {};

  const option = {
    page: page,
    // sort:{status:'canceled'},
    limit: pageSize,
    populate: [
      {
        path: "sellerId",
        select:
          "userName firstName lastName phone email status rate gender _id",
        populate: {
          path: "coverageArea",
          select: "governorateName regionName",
        },
      },
      {
        path: "buyerId",
        select:
          "userName firstName lastName phone email status address gender _id",
      },
      {
        path: "products",
        populate: {
          path: "_id",
          select:
            "name description image price addOns reviews avgRate status _id",
        },
      },
    ],
  };
  const allOrders = await orderModel.paginate(
    {
      $and: [
        minPriceQuery,
        maxPriceQuery,
        orderStatusQuery,
        orderIdQuery,
        buyerIdQuery,
        sellerIdQuery,
      ],
    },
    option
  );

  res.json(allOrders);
};

const getCountDeliveredOrdersForSeller = async (id) => {
  return await orderModel.find({ sellerId: id, status: "delivered" }).count();
};
const getCountInprogressOrdersForSeller = async (id) => {
  return await orderModel.find({ sellerId: id, status: "in progress" }).count();
};
const getOrdersForSpecificSeller = (req, res, next) => {
  let { id } = req.params;
  id ? "" : (id = req.seller._id);
  orderModel
    .find({ sellerId: id })
    .populate({
      path: "buyerId",
      select:
        "userName firstName lastName phone email status address gender -_id",
    })
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
    .then(async (data) => {
      if (!data) {
        return next(new AppError("accountNotFound"));
      }

      res.json(data);
    });
};

const getSpecificOrderForSpecificSeller = (req, res, nex) => {
  const { sellerId, orderId } = req.params;
  orderModel
    .find({ _id: orderId, sellerId: sellerId })
    .populate({
      path: "buyerId",
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
const updateOrderStatusForSeller = async (req, res, next) => {
  const seller = req.seller;
  const { orderId, status } = req.body;
  console.log(orderId, status);
  let order ;
  try {
    order = await orderModel
      .findOneAndUpdate(
        { sellerId: seller._id, _id: orderId },
        { status },
        { new: true, runValidators: true }
      )
      .populate("buyerId");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  console.log(order.buyerId.socketId);
  console.log(order);

  const io = req.app.get("socketio");
  io.to(order.buyerId.socketId).emit("updateOrderStatus", order);
  res.json(order);
};
module.exports = {
  getOrders,
  getOrdersForSpecificBuyer,
  getOrdersForSpecificSeller,
  getSpecificOrderForSpecificSeller,
  getCountInprogressOrdersForSeller,
  getCountDeliveredOrdersForSeller,
  updateOrderStatusForSeller,
};
