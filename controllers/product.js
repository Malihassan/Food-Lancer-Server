const productModel = require("../models/product");
const AppError = require("../helpers/ErrorClass");
const addProduct = async (req, res, next) => {
    const { id } = req.seller;
    const body = req.body;
    categoryName = "Pizza";
    const category = await categoryModel.findOne({ name: categoryName }).exec();
    if (!category) {
      return next(new AppError("categoryNotFound"));
    }
    const { name, description, image, price, addOns } = body;
    await productModel
      .create({
        categoryId: category._id,
        sellerId: id,
        name,
        description,
        image,
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
  try {
    const products = await productModel.find({}).populate({
      path: "sellerId",
      // populate: {
      //   path: "coverage-area",
      //   model: "coverageArea",
      // },
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
    });
    res.json(products);
  } catch (error) {
    res.status(400).send();
  }
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
    res.json({ messgae: "product updated" });
  } catch (error) {
    res.status(401).json(error.message);
  }
};
const getOneProduct = function (req, res, next) {
  const { id } = req.params;
  productModel
    .findOne({ _id: id })
    .then((data) => {
      res.json(data);
    })
    .catch(() => {
      next(new AppError("noProductFound"));
    });
};
const getProductsForSpecificSeller = async (req, res, next) => {
  const { id } = req.params;
  const products = await productModel.find({sellerId:id});
  if (!products) {
    return next(new AppError("accountNotFound"));
  }
  res.json(products);
};
const getSpecifcProductForSpecificSeller = async (req, res, next) => {
  const { id ,productId} = req.params;
  const products = await productModel.find({sellerId:id,_id:productId});
  if (products.length === 0) {
    return next(new AppError("accountNotFound"));
  }
  res.json(products);
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
  getSpecifcProductForSpecificSeller
};
