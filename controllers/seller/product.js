const productModel = require("../../models/product");
const categoryModel = require("../../models/category");
//const AppError = require("../../helpers/ErrorClass");
//////////add product
///1-get category id by category name || creat new category       (NOT NOW)
///2-add product by the seller -[(categryid=>by developer),(seller id=>by developer),(reviews),(avg rate)]
///3-sellerid => the token || database
///3-the reviews=> get seller id , get buyer id ,buyer comment (by buyer)
///4-avg rate => the reviews rate
const addProduct = async (body, categoryName) => {
  const category = await categoryModel.findOne({ name: categoryName }).exec();
  if (!category) {
    return category
  }
  const { name, description, image, price, addOns } = body;
  if (!validPass) throw new AppError("InvalidPassword"); 
try {
  await productModel.create({
    categoryId: category._id,
    sellerId: "620840ad4d1be856d21f29f7",
    name,
    description,
    image,
    price,
    addOns,
    reviews: [],
    avgRate: "0"
  })
} catch (error) {
  
}
  return productModel.find()
};
const deleteProduct = async (id) => {
  const productId = id;
  const deletedProduct = await productModel.findByIdAndDelete(productId).exec();
  console.log(deletedProduct);
    if (!deletedProduct){
      return deletedProduct
    }
    return productModel.find()
};
module.exports = {
  addProduct,
  deleteProduct,
};
