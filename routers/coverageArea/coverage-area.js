const express = require("express");
const router = express.Router();
const adminAuthentication = require("../../middleware/adminAuth");
const coverageController = require("../../controllers/coverageArea");
router.post(
	"/",
	adminAuthentication
	,
	coverageController.createCoverageArea
);
router.delete(
	"/:id",
	adminAuthentication,
	coverageController.deleteCoverageArea
);
router.get(
	"/",
	adminAuthentication
	,
	coverageController.displayAllCoverageArea
);
module.exports = router;