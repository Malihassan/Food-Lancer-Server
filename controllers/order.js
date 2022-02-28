const orderModel = require("../models/order");
const AppError = require("../helpers/ErrorClass");

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

function getAllOrders(req, res, next) {
	orderModel
		.find()
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
		.then((data) => {
			if (!data) {
				return next(new AppError("accountNotFound"));
			}
			res.json(data);
		});
}
function getOrdersForSpecificQuery(req, res, next) {
	const { minPrice, maxPrice, orderStatus } = req.query;

	const minPriceQuery = minPrice ? { totalPrice: { $gte: minPrice } } : {};
	const maxPriceQuery = maxPrice ? { totalPrice: { $lte: maxPrice } } : {};
	const orderStatusQuery = orderStatus ? { status: orderStatus } : {};

	orderModel
		.find({
			$and: [minPriceQuery, maxPriceQuery, orderStatusQuery],
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
		.then((data) => {
			if (!data) {
				return next(new AppError("accountNotFound"));
			}
			res.json(data);
		});
}

module.exports = {
	getOrdersForSpecifcBuyer,
	getAllOrders,
	getOrdersForSpecificQuery,
};
