const express = require("express");
const router = express.Router();
const coverageController = require("../../controllers/coverageArea");
router.post(
	"/",
	coverageController.createCoverageArea
);
router.delete(
	"/:id",
	coverageController.deleteCoverageArea
);
router.get(
	"/",
	coverageController.displayAllCoverageArea
);
module.exports = router;