const sellerModel = require("../../models/seller");
//const categoryModel = require("../../models/category");
const AppError = require("../../helpers/ErrorClass");
const getSeller = async (req, res, next) => {
  const data = await sellerModel.find({status:"active"});
  if (!data) {
    return next(new AppError("accountNotFound"));
  }
  res.json(data);
};


module.exports = {
  getSeller,
}