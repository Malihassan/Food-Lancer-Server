const productModel = require("../../models/product");
const categoryModel = require("../../models/category");
const AppError = require("../../helpers/ErrorClass");
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
      populate: {
        path: 'coverage-area',
        populate:{
          path:'_id'
        }       
      } ,
      select: {
        password: 0,
        token: 0,
        confirmationCode: 0,
        createdAt: 0,
        updatedAt: 0,
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
      return next(new AppError('accountNotFound'))
    }
    res.json({messgae:'product updated'})
  } catch (error) {
    res.status(401).json(error.message)
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  deleteProduct,
  getProductsForSpecifcSeller,
  updateProductForSpecifcSeller,
  updateStatus,
};
