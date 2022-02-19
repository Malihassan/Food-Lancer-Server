// const buyerModel = require("../../models/buyer");
const orderModel = require("../../models/order");
const AppError = require("../../helpers/ErrorClass");

const getOrdersForSpecifcBuyer = async (req, res, next) => {
    const {id}=req.params;
    // const buyerID= await buyerModel.findOne({userName:userName});
    const data=await orderModel.find({ buyerId:id });
      if (!data) {
        return next(new AppError('accountNotFound')); 
      }
      res.json(data)
  }
  
  module.exports = {
    getOrdersForSpecifcBuyer,
  };
  