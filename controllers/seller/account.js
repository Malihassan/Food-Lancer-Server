const AppError = require("../../helpers/ErrorClass");
const sellerModel = require("../../models/seller");
const coverageAreaModel = require("../../models/coverageArea");
const jwt = require("jsonwebtoken");
require("dotenv").config();
/**
 * async (req, res, next) => {
	const { email, password } = req.body;
	try {
		if (!email) return next(new AppError("allFieldsRequired"));
		if (!password) return next(new AppError("allFieldsRequired"));

		const token = await accountController.login(email, password);
		res.json({ token });
	} catch (error) {
		next(error);
	}
}
 */
async function login(req, res, next) {
  const { email, password } = req.body
  if (!validatorLoginRequestBody(email, password)) {
    return next(new AppError('allFieldsRequired'))
  }

  const user = await sellerModel.findOne({ email });
  if (!user) return next(new AppError("emailNotFound"));

  const validPass = await user.comparePassword(password);
  if (!validPass) return next(new AppError("InvalidPassword"));

  const token = jwt.sign({ id: user._id }, process.env.SECRETKEY, {
    expiresIn: "1d",
  });
  // save new token
  sellerModel.findByIdAndUpdate(user.id, token);
  res.json({ token });
}

function validatorLoginRequestBody(email, password) {  
  if (!email || email.length == 0 || !password || password.length == 0) {
    return false
  }
  return true
}

async function updateSeller(
  id,
  phone,
  password,
  firstName,
  lastName,
  coverageArea
) {
  const user = await sellerModel.findById(id);
  if (!user) {
    return;
  }

  user.phone = phone ? phone : user.phone;

  user.password = password ? password : user.password;

  user.firstName = firstName ? firstName : user.firstName;

  user.lastName = lastName ? lastName : user.lastName;

  if (coverageArea) {
    const newArea = await coverageAreaModel.findById(coverageArea);
    if (!newArea) {
      return "No Area";
    }
    user.coverageArea = newArea;
  }

  user.save();
  return user;
}

module.exports = {
  login,
  updateSeller,
};
