const productModel = require("../models/product");
const categoryModel = require("../models/category");
const AppError = require("../helpers/ErrorClass");
const config = require("../config/pendingConfig");
const cloudinary = require("../config/cloudinaryConfig");
const addProduct = async (req, res, next) => {
  const { id } = req.seller;
  const body = req.body;
  const { name, description, price, addOns } = body;
  categoryName = "Pizza";
  const category = await categoryModel.findOne({ name: categoryName }).exec();
  if (!category) {
    return next(new AppError("categoryNotFound"));
  }
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    await productModel
      .create({
        categoryId: category._id,
        sellerId: id,
        name,
        description,
        image: [{ url: result.secure_url, _id: result.public_id }],
        price,
        addOns,
        reviews: [],
        avgRate: "0",
        status: "pending",
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        //return next(new AppError({ 401: err.message }));
        res.status(401).json(err.message); //////////custome error
      });
    await productModel.find().then((products) => {
      res.json(products);
    });
  } catch (error) {
    console.log(error);
  }
};
const deleteProduct = (req, res, next) => {
  productModel
    .findOneAndDelete({ _id: req.params.id, sellerId: sellerId.id })
    .then((deleted) => {
      if (!deleted) {
        return next(new AppError("accountNotFound"));
      }
      res.json("deleted done successfully");
    })
    .catch((e) => res.status(401).json(e.message));
};
const updateProductForSpecifcSeller = (req, res, next) => {
  const { id } = req.params;
  const idSeller = req.seller;
  const { name, description, image, price, addOns } = req.body;
  productModel
    .findOneAndUpdate(
      { _id: id, sellerId: idSeller },
      { name, description, image, price, addOns },
      { new: true, runValidators: true }
    )
    .then((data) => {
      if (!data) {
        return next(new AppError("accountNotFound"));
      }
      res.json(data);
    })
    .catch((e) => res.status(401).json(e.message));
};
const getProductsForSpecifcSeller = async (req, res, next) => {
  const { id } = req.seller;
  const data = await productModel.find({ sellerId: id });
  if (!data) {
    return next(new AppError("accountNotFound"));
  }
  res.json(data);
};
const getAllProducts = async (req, res, next) => {
  const { page } = req.query;
  const pageSize = 4;
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
  try {
    const products = await productModel.paginate({}, options); 
    res.json(products)
    if (products.length === 0) {
      return next(new AppError("noProductFound"));
    }
    res.json(allSellers);
  } catch (error) {
    return error
  }
 
};
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
    .then((data) => {
      res.json(data);
    })
    .catch(() => {
      next(new AppError("noProductFound"));
    });
};
const getProductsForSpecificSeller = async (req, res, next) => {
  const { id } = req.params;
  const products = await productModel.find({ sellerId: id });
  if (!products) {
    return next(new AppError("accountNotFound"));
  }
  res.json(products);
};
const getSpecifcProductForSpecificSeller = async (req, res, next) => {
  const { id, productId } = req.params;
  const products = await productModel.find({ sellerId: id, _id: productId });
  if (products.length === 0) {
    return next(new AppError("accountNotFound"));
  }
  res.json(products);
};
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
    res.json({ messgae: "product Accepted" });
  } catch (error) {
    res.status(401).json(error.message);
  }
};
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
module.exports = {
  addProduct,
  getAllProducts,
  deleteProduct,
  getProductsForSpecifcSeller,
  updateProductForSpecifcSeller,
  updateStatus,
  getOneProduct,
  getProductsForSpecificSeller,
  getSpecifcProductForSpecificSeller,
  pendingMessage,
};