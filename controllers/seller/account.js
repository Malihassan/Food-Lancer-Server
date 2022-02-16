const AppError = require("../../helpers/ErrorClass");
const sellerModel = require("../../models/seller");
const jwt = require('jsonwebtoken')
require("dotenv").config();

async function login(email, password) {
  const user = await sellerModel.findOne({ email });
  if (!user) throw new AppError("emailNotFound");

  const validPass = await user.comparePassword(password);
  if (!validPass) throw new AppError("InvalidPassword"); 

  const token = jwt.sign({ id: user._id }, process.env.SECRETKEY, { expiresIn: "1d" });
  // save new token
  await sellerModel.findByIdAndUpdate(user.id,{token},{new: true})
  return token
}

module.exports = {
  login,
};
