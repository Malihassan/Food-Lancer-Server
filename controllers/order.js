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

function getOrders(req, res, next) {
	const { minPrice, maxPrice, orderStatus, id, buyerId, sellerId, page } =
		req.query;

	var count;
	const pageSize = 1;

	const minPriceQuery = minPrice ? { totalPrice: { $gte: minPrice } } : {};
	const maxPriceQuery = maxPrice ? { totalPrice: { $lte: maxPrice } } : {};
	const orderStatusQuery = orderStatus ? { status: orderStatus } : {};
	const orderIdQuery = id ? { _id: id } : {};
	const buyerIdQuery = buyerId ? { buyerId } : {};
	const sellerIdQuery = sellerId ? { sellerId } : {};

	orderModel
		.find({
			$and: [
				minPriceQuery,
				maxPriceQuery,
				orderStatusQuery,
				orderIdQuery,
				buyerIdQuery,
				sellerIdQuery,
			],
		})
		.populate({
			path: "sellerId",
			select: "userName firstName lastName phone email status gender -_id",
		})
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
		.skip(pageSize * (page - 1))
		.limit(pageSize)
		.then(async (data) => {
			if (
				minPriceQuery == {} ||
				maxPriceQuery == {} ||
				orderStatusQuery == {} ||
				orderIdQuery == {} ||
				buyerIdQuery == {} ||
				sellerIdQuery == {}
			) {
				count = data.length;

			} else {
				// console.log(data.length);
				count = await orderModel.count({});

			}

			if (!data) {
				return next(new AppError("accountNotFound"));
			}
			res.json({ data, countOfOrders: count });
		});
}

// function getOrdersForSpecificQuery(req, res, next) {
// 	const { minPrice, maxPrice, orderStatus } = req.query;

// 	const minPriceQuery = minPrice ? { totalPrice: { $gte: minPrice } } : {};
// 	const maxPriceQuery = maxPrice ? { totalPrice: { $lte: maxPrice } } : {};
// 	const orderStatusQuery = orderStatus ? { status: orderStatus } : {};

// 	orderModel
// 		.find({
// 			$and: [minPriceQuery, maxPriceQuery, orderStatusQuery],
// 		})
// 		.populate({
// 			path: "sellerId",
// 			select: "userName firstName lastName phone email status gender -_id",
// 		})
// 		.populate({
// 			path: "buyerId",
// 			select: "userName firstName lastName phone email status gender -_id",
// 		})
// 		.populate({
// 			path: "products",
// 			populate: {
// 				path: "_id",
// 				select:
// 					"name description image price addOns reviews avgRate status -_id",
// 			},
// 		})
// 		.then((data) => {
// 			if (!data) {
// 				return next(new AppError("accountNotFound"));
// 			}
// 			res.json(data);
// 		});
// }
// const getSpecificOrder = (req, res, next) => {
// 	const { id } = req.params;
// 	orderModel
// 		.findOne({ _id: id })
// 		.populate({
// 			path: "buyerId",
// 			select: "userName firstName lastName phone email status gender -_id",
// 		})
// 		.populate({
// 			path: "sellerId",
// 			select: "userName firstName lastName phone email status gender -_id",
// 		})
// 		.populate({
// 			path: "products",
// 			populate: {
// 				path: "_id",
// 				select:
// 					"name description image price addOns reviews avgRate status -_id",
// 			},
// 		})
// 		.then((data) => {
// 			if (!data) {
// 				return next(new AppError("accountNotFound"));
// 			}
// 			res.json(data);
// 		});
// };
module.exports = {
	getOrdersForSpecificBuyer,
	getOrders,
	// getOrdersForSpecificQuery,
	// getSpecificOrder,
};
