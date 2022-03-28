const jwt = require("jsonwebtoken");
const AppError = require("../helpers/ErrorClass");
const buyerModel = require("../models/buyer");
require("dotenv").config();

async function buyerAuth(req, res, next) {
  try {
    const { token } = req.headers;
    const payload = jwt.verify(token, process.env.SECRETKEY);
    const buyer = await buyerModel.findById(payload.id);
    if (!buyer) {
      return next(new AppError("accountNotFound"));
    }
    req.buyer = buyer;
    next();
  } catch (error) {
    next(new AppError('JsonWebTokenError'));
  }
}
module.exports = buyerAuth;
