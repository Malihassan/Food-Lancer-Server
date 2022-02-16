const jwt = require("jsonwebtoken");
const AppError = require("../helpers/ErrorClass");
const sellerModel = require("../models/seller");
require("dotenv").config();

async function sellerAuth(req, res, next) {
  try {
    const { token } = req.headers;
    const payload = jwt.verify(token, process.env.SECRETKEY);
    const seller = await sellerModel.findById(payload.id);
    if (!seller) {
      return next(new AppError("accountNotFound"));
    }
    req.seller = seller;
    next();
  } catch (error) {
    next(new AppError('JsonWebTokenError'));
  }
}
module.exports = sellerAuth;
