const productModel = require("../models/product");
const orderModel = require("../models/order");
const categoryModel = require("../models/category");
const AppError = require("../helpers/ErrorClass");
const config = require("../config/emailsConfig");
const cloudinary = require("../config/cloudinaryConfig");
var mongoose = require("mongoose");
const sellerModel = require("../models/seller");

//const { path } = require("express/lib/application");
//seller==>add product
const addProduct = async (req, res, next) => {
	const { id } = req.seller;
	let arr3 = [];
	const body = req.body;
	const { name, description, price, addOns, categoryId } = body;
	const category = await categoryModel.findOne({ _id: categoryId }).exec();
	if (!category) {
		return next(new AppError("categoryNotFound"));
	}
	try {
		const images = await req.files;
		for (let img of images) {
			let result = await cloudinary.uploader.upload(img.path);
			arr3.push({ url: result.secure_url, _id: result.public_id });
		}
		await productModel
			.create({
				categoryId: category._id,
				sellerId: id,
				name,
				description,
				image: arr3,
				//image:[],
				price,
				addOns,
				//reviews: [],
				//image,
				//reviews,
				avgRate: "0",
				status: "pending",
			})
			.then((data) => {
				res.json(data);
			})
			.catch((err) => {
				res.status(401).json(err.message); //////////custome error
			});
	} catch (error) {
		console.log(error);
	}
};
//seller==>check product validation
const checkSellerProductBeforeSignup = async (req, res, next) => {
	const { name } = req.body;
	const productNameExist = await productModel.findOne({ name });
	if (productNameExist) {
		return next(new AppError("productUniqueName"));
	}
	next();
};
//seller==>delete product
const deleteProduct = (req, res, next) => {
	const seller = req.seller;
	productModel
		.findOneAndDelete({ _id: req.params.id, sellerId: seller._id })
		.then((deleted) => {
			if (!deleted) {
				return next(new AppError("accountNotFound"));
			}
			res.json("deleted done successfully");
		})
		.catch((e) => res.status(401).json(e.message));
};
//seller==>update product
const updateProductForSpecifcSeller = async (req, res, next) => {
	const { id } = req.params;
	const idSeller = req.seller;
	let imgs = [];
	const { name, description, price, addOns } = req.body;
	try {
		if (req.files[0]) {
			const images = await req.files;
			for (let img of images) {
				let result = await cloudinary.uploader.upload(img.path);
				imgs.push({ url: result.secure_url, _id: result.public_id });
			}

			productModel
				.findOneAndUpdate(
					{ _id: id, sellerId: idSeller },
					{ name, description, image: imgs, price, addOns },
					{ new: true, runValidators: true }
				)
				.then((data) => {
					// if (!data) {
					// 	return next(new AppError("accountNotFound"));
					// }
					res.json(data);
				})
				.catch((e) => res.status(401).json(e.message));
		} else {
			productModel
				.findOneAndUpdate(
					{ _id: id, sellerId: idSeller },
					{ name, description, price, addOns },
					{ new: true, runValidators: true }
				)
				.then((data) => {
					// if (!data) {
					// 	return next(new AppError("accountNotFound"));
					// }
					res.json(data);
				})
				.catch((e) => res.status(401).json(e.message));
		}
	} catch (e) {}
};
//seller==>all products
const getProductsForSpecificSeller = async (req, res, next) => {
	let sellerId;
	const { id } = req.params;
	sellerId = id;
	if (req.seller) {
		sellerId = req.seller._id;
	}

	let { page = 1 } = req.query;
	const pageSize = 12;
	const options = {
		page: page,
		limit: pageSize,
		populate: [
			{
				path: "sellerId",
				select: {
					userName: 1,
					firstName: 1,
					lastName: 1,
					phone: 1,
					email: 1,
					rate: 1,
					status: 1,
					gender: 1,
					"coverage-area": 1,
				},
			},
			{
				path: "categoryId",
				select: "name",
			},
		],
	};
	const products = await productModel.paginate(
		{
			sellerId,
		},
		options
	);
	if (!products) {
		return next(new AppError("accountNotFound"));
	}
	res.json(products);
};
//seller==>one product
const getSpecifcProductForSpecificSeller = async (req, res, next) => {
	const { sellerId, productId } = req.params;
	const { _id } = req.seller;
	const products = await productModel.find({ sellerId: _id, _id: productId });
	// if (products.length === 0) {
	//   return next(new AppError("accountNotFound"));
	// }
	res.json(products);
};
//buyer==>all product
const getAllProductsForBuyer = async (req, res, next) => {
	let { page = 1, min, max, rate, status, categoryId = [] } = req.query;
	status = status ? { status } : { status: "active" };

	const categoryIdQuery =
		categoryId.length !== 0 ? { categoryId: { $in: categoryId } } : {};

	const minPriceQuery = min ? { price: { $gte: min } } : {};
	const maxPriceQuery = max ? { price: { $lte: max } } : {};
	const minRate = rate ? { avgRate: { $gte: rate } } : {};
	const pageSize = 12;
	const options = {
		page: page,
		limit: pageSize,
		populate: [
			{
				path: "sellerId",
				select: {
					userName: 1,
					firstName: 1,
					lastName: 1,
					phone: 1,
					email: 1,
					rate: 1,
					status: 1,
					gender: 1,
					"coverage-area": 1,
				},
			},
			{
				path: "categoryId",
				select: "name",
			},
		],
	};
	const products = await productModel.paginate(
		{
			$and: [status, categoryIdQuery, minPriceQuery, maxPriceQuery, minRate],
		},
		options
	);
	if (products.docs.length === 0) {
		return next(new AppError("noProductFound"));
	}

	res.json(products);
};
//buyer==>seller products
const getProductsForSpecifcSellerForBuyer = async (req, res, next) => {
	const { id } = req.params;

	const data = await productModel
		.find({ sellerId: id, status: "active" })
		.populate({
			path: "sellerId",
			select: "userName ",
		});
	if (!data) {
		return next(new AppError("accountNotFound"));
	}
	res.json(data);
};
//admin==>all products
const getAllProducts = async (req, res, next) => {
	let { page = 1, status, categoryId } = req.query;
	status = status ? { status } : {};
	categoryId = categoryId ? { categoryId } : {};
	const pageSize = 12;
	const options = {
		page: page,
		limit: pageSize,
		populate: [
			{
				path: "sellerId",
				select: {
					userName: 1,
					firstName: 1,
					lastName: 1,
					phone: 1,
					email: 1,
					rate: 1,
					status: 1,
					gender: 1,
					"coverage-area": 1,
				},
			},
			{
				path: "categoryId",
				select: "name",
			},
		],
	};
	const products = await productModel.paginate(
		{
			$and: [status, categoryId],
		},
		options
	);
	if (products.docs.length === 0) {
		return next(new AppError("noProductFound"));
	}
	res.json(products);
};
//admin==>one product //buyer==>one product
const getOneProduct = function (req, res, next) {
	const { id } = req.params;

	productModel
		.findOne({ _id: id })
		.populate({
			path: "sellerId",
			select: "email userName",
		})
		.populate({
			path: "categoryId",
			select: "name",
		})
		.populate({
			path: "reviews.buyerId",
			select: "email userName",
		})
		.then((data) => {
			res.json(data);
		})
		.catch((e) => {
			next(new AppError("noProductFound"));
		});
};
//admin==>pending product
const pendingMessage = async (req, res, next) => {
	const { id } = req.params;
	const { pendingMessage } = req.body;
	const product = await productModel
		.findByIdAndUpdate(
			{ _id: id },
			{ pendingMessage },
			{ new: true, runValidators: true }
		)
		.populate({
			path: "sellerId",
			select: "email userName",
		});
	const userEmail = product.sellerId.email;
	res.json(userEmail);
	config.sendPendingMessage(pendingMessage, userEmail);
};
//admin==>upadate product
const updateStatus = async (req, res, next) => {
	const { id } = req.params;
	const { status } = req.body;
	try {
		const updated = await productModel.findOneAndUpdate(
			{ _id: id },
			{ status },
			{ new: true, runValidators: true }
		);
		if (!updated) {
			return next(new AppError("accountNotFound"));
		}
		res.json({ messgae: updated.status });
	} catch (error) {
		res.status(401).json(error.message);
	}
};
//who
const updateSpecificProductForSpecificSeller = (req, res, next) => {
	const { sellerId, productId } = req.params;
	const { status, reasonOfCancellation } = req.body;
	productModel
		.findOneAndUpdate(
			{ _id: productId, sellerId: sellerId },
			{ reasonOfCancellation, status },
			{ new: true, runValidators: true }
		)
		.then((data) => {
			if (!data) {
				return next(new AppError("accountNotFound"));
			}
			res.json(data);
		})
		.catch((e) => res.status(400).json(e.message));
};
//who
const updateReview = async (req, res, next) => {
	const { comments, rate, sellerId, orderId } = req.body;
	const buyerId = req.buyer._id;
	const { productId } = req.params;

	try {
		const checked = await productModel.findOne({
			_id: productId,
			"reviews.buyerId": buyerId,
			"reviews.sellerId": sellerId,
			"reviews.orderId": orderId,
		});
		if (checked) {
			return next(new AppError("reviewAlreadyAdded"));
		}
		const updated = await productModel.findOneAndUpdate(
			{ _id: productId },
			{
				$push: {
					reviews: {
						buyerId: mongoose.Types.ObjectId(buyerId),
						sellerId: mongoose.Types.ObjectId(sellerId),
						orderId: mongoose.Types.ObjectId(orderId),
						comments,
						rate,
					},
				},
			},
			{ new: true, runValidators: true }
		);
		if (!updated) {
			return next(new AppError("accountNotFound"));
		}
		next();
		// res.json(checked);
	} catch (error) {
		res.status(401).json(error.message);
	}
};
//who
const updateRate = async (req, res, next) => {
	const buyer = req.buyer;
	const { productId } = req.params;
	await productModel.findOneAndUpdate({ _id: productId }, [
		{ $set: { avgRate: { $avg: "$reviews.rate" } } },
	]);
	const { sellerId } = req.body;
	let rateSeller = 0;
	const products = await productModel.find({ sellerId });
	for (const product of products) {
		rateSeller = rateSeller + product.avgRate;
	}
	rateSeller = rateSeller / products.length;
	const sellerDetailes = await sellerModel.findOneAndUpdate(
		{ _id: sellerId },
		[{ $set: { rate: rateSeller } }],
		{ new: true, runValidators: true }
	);

	const orders = await orderModel
		.find({ buyerId: buyer._id })
		.sort({ createdAt: -1 })
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
		});

	// const io = req.app.get("io");
	// io.to(buyer.socketId).emit("updateRateOfSeller", orders);
	res.status(200).json(orders);
};

const getProductsForSpecifcSellerForAdmin = async (req, res, next) => {
	const { id } = req.params;

	const data = await productModel.find({ sellerId: id });

	if (!data) {
		return next(new AppError("accountNotFound"));
	}

	res.json(data);
};
module.exports = {
	addProduct,
	pendingMessage,
	getAllProducts,
	getProductsForSpecifcSellerForBuyer,
	getProductsForSpecifcSellerForAdmin,
	getAllProductsForBuyer,
	getOneProduct,
	getProductsForSpecificSeller,
	getSpecifcProductForSpecificSeller,
	deleteProduct,
	updateProductForSpecifcSeller,
	updateStatus,
	updateReview,
	updateRate,
	updateSpecificProductForSpecificSeller,
	checkSellerProductBeforeSignup,
};
