const productModel = require("../../models/product");
const categoryModel = require("../../models/category");
const AppError=require('../../helpers/ErrorClass');
const addProduct = async (body, categoryName) => {
  ////1-get category id using category name
  const category = await categoryModel.findOne({ name: categoryName }).exec();
  console.log(category);
  if (!category) {
    return category;
  }
  const { name, description, image, price, addOns } = body;
  return productModel.create({
    categoryId: category._id,
    sellerId: "620840ad4d1be856d21f29f7",
    name,
    description,
    image,
    price,
    addOns,
    reviews: [],
    avgRate: "4.5"
  });
};
const deleteProduct = (id) => {
  const productId = id;
  return productModel.findByIdAndDelete(productId).catch(e);
};
const updateProductForSpecifcSeller = (req, res, next) => {
  const { id } = req.params;
  const idSeller=req.seller;
  const { name, description, image, price, addOns } = req.body;
  productModel.findOneAndUpdate({ _id: id,sellerId:idSeller }, { name, description, image, price, addOns }, { new: true, runValidators: true })
    .then((data) => {
      if (!data) {
        return next(new AppError('accountNotFound')); 
      }
      res.json(data)
    }).catch(e => res.status(401).json(e.message))

}
const getProductsForSpecifcSeller = async (req, res, next) => {
  const {id}=req.seller;
  const data=await productModel.find({ sellerId: id });
    if (!data) {
      return next(new AppError('accountNotFound')); 
    }
    res.json(data)
}

module.exports = {
  addProduct,
  deleteProduct,
  getProductsForSpecifcSeller,
  updateProductForSpecifcSeller
};
