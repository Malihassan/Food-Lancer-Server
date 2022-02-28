const sellerModel = require("../../models/seller");
const productModel = require("../../models/product");
const AppError = require("../../helpers/ErrorClass");
const getallSellers = async (req, res, next) => {
  const data = await sellerModel.find();
  if (data.length === 0) {
    return next(new AppError("noSellerFound"));
  }
}
const getSellersByStatus = async (req, res, next) => {
  const { status } = req.params;
  const data = await sellerModel.find({ status });
  if (data.length === 0) {
    return next(new AppError("noSellerFound"));
  }
  res.json(data);
};
const getSpecificSeller = async (req, res, next) => {
  const { id } = req.params;
  const seller = await sellerModel.findById(id);
  if (!seller) {
    return next(new AppError("accountNotFound"));
  }
  res.json(seller); 
  res.json("done")
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

const updateSeller = function(req, res, next){
  const {id} = req.params;
  const {status} = req.body;
  _editSeller(id, status).then(() =>{
      res.send('edited successfuly');
  }).catch(()=>{
      next(new AppError('UnauthorizedError'));
  })
}

const _editSeller = function(id, status){
  const options = {runValidators: true, new: true};
  return sellerModel.findOneAndUpdate({_id: id}, {status}, options);
}

module.exports = {
  getSellersByStatus,
  getallSellers,
  updateSeller,
  getSpecificSeller,
  getProductsForSpecificSeller,
  getSpecifcProductForSpecificSeller,
};
