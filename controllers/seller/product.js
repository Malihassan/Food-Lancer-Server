const productModel = require("../../models/product");
const categoryModel = require("../../models/category");
//const AppError = require("../../helpers/ErrorClass");
//////////add product
///1-get category id by category name || creat new category       (NOT NOW)
///2-add product by the seller -[(categryid=>by developer),(seller id=>by developer),(reviews),(avg rate)]
///3-sellerid => the token || database
///3-the reviews=> get seller id , get buyer id ,buyer comment (by buyer)
///4-avg rate => the reviews rate
const addProduct = async (body, categoryName,idSeller) => {
  const category = await categoryModel.findOne({ name: categoryName }).exec();
  if (!category) {
    return category
  }
  const { name, description, image, price, addOns } = body;
  const sellerId = idSeller
  await productModel.create({
    categoryId: category._id,
    sellerId: sellerId,
    name,
    description,
    image,
    price,
    addOns,
    reviews: [],
    avgRate: "0"
  })
  return productModel.find()
};
const deleteProduct =  async (id,idSeller) => {
  const productId = id;
  const sellerId = idSeller
  //const deletedProduct = await productModel.findByIdAndDelete(productId).exec();
  const deletedProduct = await productModel.findOneAndDelete({id:productId,sellerId:sellerId}).exec();
  console.log(deletedProduct);
    if (!deletedProduct){
      return deletedProduct
    }
    return productModel.find()
};
const getProductsForSpecifcSeller = async (id) => {
  return await productModel.find({ sellerId: id });
}
const updateProductForSpecifcSeller = async (idProduct ,data) => {
  const { name, description, image, price, addOns } = data;
  return await productModel.findOneAndUpdate({ _id: idProduct }, { name: name, description, image , price, addOns},{new: true ,runValidators: true});
}
module.exports = {
  addProduct,
  deleteProduct,
  getProductsForSpecifcSeller,
  updateProductForSpecifcSeller
};
