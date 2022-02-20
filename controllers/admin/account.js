const AppError = require("../../helpers/ErrorClass");
const AdminModel = require("../../models/admin");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function login(req, res, next) {
	const { email, password } = req.body;
	if (!email || !password) {
		return next(new AppError("allFieldsRequired"));
	}

	const user = await AdminModel.findOne({ email });
	if (!user) return next(new AppError("emailNotFound"));

	const validPass = await user.comparePassword(password);
	if (!validPass) return next(new AppError("InvalidPassword"));

	res.send("Logged in Successfully");

	const token = await _tokenCreator(user.userName, user.id);
	// save new token
	AdminModel.findByIdAndUpdate(user.id, token);
	res.json({ token });
}

const _tokenCreator = async function (userName, _id) {
	token = await jwt.sign({ userName, id: _id }, process.env.SECRETKEY, {
		expiresIn: "1d",
	});
	return token;
};

module.exports = {
	login,
};
