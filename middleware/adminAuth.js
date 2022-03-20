const jwt = require("jsonwebtoken");
const AppError = require("../helpers/ErrorClass");
const AdminModel = require("../models/admin");
require("dotenv").config();

async function adminAuth(req, res, next) {
	try {
		const { token } = req.headers;
		const payload = jwt.verify(token, process.env.SECRETKEY);
		const admin = await AdminModel.findById(payload.id);
		if (!admin) {
			return next(new AppError("JsonWebTokenError"));
		}
		req.admin = admin;
		next();
	} catch (error) {
		next(new AppError("JsonWebTokenError"));
	}
}
module.exports = adminAuth;
