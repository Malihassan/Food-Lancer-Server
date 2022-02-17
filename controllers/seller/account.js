const AppError = require("../../helpers/ErrorClass");
const sellerModel = require("../../models/seller");
const coverageAreaModel = require("../../models/coverageArea");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function login(email, password) {
	const user = await sellerModel.findOne({ email });
	if (!user) throw new AppError("emailNotFound");

	const validPass = await user.comparePassword(password);
	if (!validPass) throw new AppError("InvalidPassword");

	const token = jwt.sign({ id: user._id }, process.env.SECRETKEY, {
		expiresIn: "1d",
	});
	// save new token
	sellerModel.findByIdAndUpdate(user.id, token);
	return token;
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
