const orderModel = require("../models/order");
const AppError = require("../helpers/ErrorClass");
const { path } = require("express/lib/application");
const { json } = require("express/lib/response");
const sellerController = require("./seller");

const addOrder = async (req, res, next) => {
  const orderDetails = req.body;
  const newOrder = await orderModel.create(orderDetails);
  const { _id } = newOrder;
  req.body.orderId = _id;
  const selectedOrder = await orderModel
    .findOne({ _id })
    .populate({
      path: "sellerId",
      select:
        "userName firstName socketId lastName phone email status rate gender _id",
      populate: {
        path: "coverageArea",
        select: "governorateName regionName",
      },
    })
    .populate({
      path: "buyerId",
      select:
        "userName firstName lastName phone email status address gender _id",
    })
    .populate({
      path: "products",
      populate: {
        path: "_id",
        select:
          "name description image price addOns reviews avgRate status _id",
      },
    });
  const io = req.app.get("io");
  io.to(selectedOrder.sellerId.socketId).emit("addOrder", selectedOrder);
  // console.log(selectedOrder);
  next();
};

const getOrdersForSpecificBuyer = (req, res, next) => {
  const { id } = req.buyer;
  orderModel
    .find({ buyerId: id })
    .sort({ createdAt: -1 })
    .populate({
      path: "sellerId",
      select: "userName firstName lastName phone email status gender rate image",
    })
    .populate({
      path: "products",
      populate: {
        path: "_id",
        select: "name description image price addOns reviews avgRate status ",
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
    sort: { createdAt: -1 },
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
          "userName firstName lastName phone email status address gender image _id",
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
  id ? id = id : (id = req.seller._id);
  orderModel
    .find({ sellerId: id })
    .populate({
      path: "buyerId",
      select:
        "userName firstName lastName phone email status address gender",
    })
    .populate({
      path: "sellerId",
      select: "userName firstName lastName phone email status gender",
    })
    .populate({
      path: "products",
      populate: {
        path: "_id",
        select:
          "name description image price addOns reviews avgRate status",
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
  // const _id = req.seller._id ?req.seller._id:req.buyer._id;

  const { orderId, status } = req.body;
  let order;
  try {
    order = await orderModel
      .findOneAndUpdate(
        { _id: orderId },
        { status },
        { new: true, runValidators: true }
      )
      .populate("buyerId");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
/**
 * const io = req.app.get("io");
    io.to(req.seller.socketId).emit("updateOrderStatus", order);
 */
  if (req.seller) {
    const io = req.app.get("io");
    io.to(order.buyerId.socketId).emit("updateOrderStatus", order);
    req.order = order;
    next();
    return
  }
  res.json(order);
};

module.exports = {
  addOrder,
  getOrders,
  getOrdersForSpecificBuyer,
  getOrdersForSpecificSeller,
  getSpecificOrderForSpecificSeller,
  getCountInprogressOrdersForSeller,
  getCountDeliveredOrdersForSeller,
  updateOrderStatusForSeller,
};
