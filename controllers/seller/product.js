const productModel = require("../../models/product");
const categoryModel = require("../../models/category");
const AppError = require("../../helpers/ErrorClass");
const addProduct = async (req,res,next) => {
  const {id} = req.seller;
  const body = req.body;
  categoryName = "Pizza"
  const category = await categoryModel.findOne({ name: categoryName }).exec();
  if (!category) {return next(new AppError("categoryNotFound"));}
  const { name, description, image, price, addOns } = body;
   await productModel.create({
    categoryId: category._id,
    sellerId: id,
    name,
    description,
    image,
    price,
    addOns,
    reviews: [],
    avgRate: "0",
    status:"pending"
  }).then((data)=>{
console.log(data);
  }).catch((err)=>{
    console.log(err);
    //return next(new AppError({ 401: err.message }));
    res.status(401).json(err.message) //////////custome error
  })
  await productModel.find().then((products)=>{
res.json(products)
  })
};
const deleteProduct = (req,res,next) => {
 const {id} = req.params;
 const sellerId = req.seller
 console.log(id);
 console.log(sellerId.id);
   /*   productModel.findOneAndDelete({id:id},(err,data)=>{
      console.log(data);
     console.log(err);
      res.json(data)
    } 
   ) */
   productModel.findByIdAndDelete(id,(err,data)=>{
if (err) {
  return next(new AppError('accountNotFound')); 
}
return res.json("done delete")
   })
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
