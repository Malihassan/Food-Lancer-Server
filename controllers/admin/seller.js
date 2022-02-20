const sellerModel = require("../../models/seller");
const AppError = require("../../helpers/ErrorClass");
const getSeller = async (req, res, next) => {
const {status} = req.params
  const data = await sellerModel.find({status});
  if (data.length === 0) {
    return next(new AppError("noSellerFound"));
  }
  res.json(data)
};
module.exports = {
  getSeller,
}