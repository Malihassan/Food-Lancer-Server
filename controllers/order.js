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
		buyerId,
		sellerId,
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
		limit: pageSize,
		populate: [
			{
				path: "sellerId",
				select: "userName firstName lastName phone email status gender _id",
			},
			{
				path: "buyerId",
				select: "userName firstName lastName phone email status gender _id",
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
module.exports = {
	getOrdersForSpecificBuyer,
	getOrders,
	// getOrdersForSpecificQuery,
	// getSpecificOrder,
};
