const jwt = require("jsonwebtoken");
const AppError = require("../helpers/ErrorClass");
const buyerModel = require("../models/buyer");
require("dotenv").config();

async function buyerAuth(req, res, next) {
  console.log('Auth 1');
  try {
    const { token } = req.headers;
    const payload = jwt.verify(token, process.env.SECRETKEY);
    const buyer = await buyerModel.findById(payload.id);
    console.log(buyer,"Buyer");
    if (!buyer) {
      return next(new AppError("accountNotFound"));
    }
    req.buyer = buyer;
console.log(req.buyer,"buyer");
  console.log('Auth 1');
    next();
  } catch (error) {
    console.log(error.message);
    next(new AppError('JsonWebTokenError'));
  }
}
module.exports = buyerAuth;
