const productModel = require("../../models/product");
const categoryModel = require("../../models/category");
//////////add product
const addProduct = async (body,categoryName)=>{
  ////1-get category id using category name
  const category = await categoryModel.findOne({name:categoryName}).exec()
  console.log(category);
  if (!category) {
   return category
  }
 const {name,description,image,price,addOns,reviews}= body
  return productModel.create({categoryId:category._id,sellerId:"620840ad4d1be856d21f29f7",name,description,image,price,addOns,reviews,avgRate:"4.5"})
}
///1-get category id by category name || creat new category
///2-add product by the seller -[(categryid=>by developer),(seller id=>by developer),(reviews),(avg rate)]
///3-sellerid => the token || database
///3-the reviews=> get seller id , get buyer id ,buyer comment
///4-avg rate => the reviews rate
const deleteProduct = (id)=>{
const productId = id;
return productModel.findByIdAndDelete(productId).catch(e)
}
module.exports = {
  addProduct,
  deleteProduct,
}
