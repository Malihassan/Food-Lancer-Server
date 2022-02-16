const jwt = require("jsonwebtoken");
const AppError = require("../helpers/ErrorClass");
const sellerModel = require("../models/seller");
require("dotenv").config();

async function sellerAuth(req, res, next) {
  try {
    const { token } = req.headers;
    const payload = jwt.verify(token, process.env.SECRETKEY);
    const user = await sellerModel.findById(payload.id);
    if (!user) {
      return next(new AppError("accountNotFound"));
    }
    req.user = user;
    next();
  } catch (error) {
    next(new AppError('JsonWebTokenError'));
  }
}
module.exports = sellerAuth;
