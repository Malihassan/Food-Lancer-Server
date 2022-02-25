const orderModel = require("../models/order");
const AppError = require("../helpers/ErrorClass");

const getOrdersForSpecifcBuyer = (req, res, next) => {
    const {id}=req.params;
    orderModel.find({ buyerId:id }).populate({path:'sellerId',select:'userName firstName lastName phone email status gender -_id'}).populate({
      path: "products", 
      populate: {
         path: "_id" ,
         select:'name description image price addOns reviews avgRate status -_id'
      }
   })
    .then(data=>{
      if (!data) {
        return next(new AppError('accountNotFound')); 
      }
      res.json(data)
      })
  }
  
  module.exports = {
    getOrdersForSpecifcBuyer,
  };
  