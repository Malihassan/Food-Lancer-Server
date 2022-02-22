const express = require("express");
const router = express.Router();
const coverageController = require("../../controllers/coverageArea/coverage-area");
router.post(
	"/",
	coverageController.create
);
module.exports = router;