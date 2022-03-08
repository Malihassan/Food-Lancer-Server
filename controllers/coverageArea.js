const AppError = require("../helpers/ErrorClass");
const coverageAreaModule = require("../models/coverageArea");
const createCoverageArea = (req, res, next) => {
	coverageAreaModule
		.create(req.body)
		.then((data) => {
			res.json(data);
		})
		.catch((e) => res.status(400).json(e.message));
};
const deleteCoverageArea = async (req, res, next) => {
	const { id } = req.params;
	const elemDeleted = await coverageAreaModule.findOneAndDelete({ _id: id });
	if (!elemDeleted) {
		return next(new AppError("accountNotFound"));
	}
	res.json("Deleted Done");
};
const displayAllCoverageArea = async (req, res, next) => {
	const coverageAreas = await coverageAreaModule.find();
	console.log(coverageAreas);
	if (coverageAreas.length === 0) {
		return next(new AppError("noCoverageAreaFound"));
	}
	res.json(coverageAreas);
};

module.exports = {
	createCoverageArea,
	deleteCoverageArea,
	displayAllCoverageArea,
};
