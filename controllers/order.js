const orderModel = require("../models/order");
const AppError = require("../helpers/ErrorClass");
const { path } = require("express/lib/application");
const { json } = require("express/lib/response");

const getOrdersForSpecificBuyer = (req, res, next) => {
	const { id } = req.query;
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

const getOrders = async (req, res, next) => {
	const {
		minPrice,
		maxPrice,
		orderStatus,
		id,
		sellerId = req.seller._id,
		buyerId,
		page = 1,
	} = req.query;
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
	return await orderModel
		.find({ sellerId: id, status: "in progress" })
		.count();
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
module.exports = {
	getOrders,
	getOrdersForSpecificBuyer,
	getOrdersForSpecificSeller,
	getSpecificOrderForSpecificSeller,
	getCountInprogressOrdersForSeller,
	getCountDeliveredOrdersForSeller,
};
