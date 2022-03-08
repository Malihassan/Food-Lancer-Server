const express = require("express");
const router = express.Router();
const seller = require("./seller/index");
const coverageArea = require("./coverageArea/index");
const admin = require("./admin/index");
const buyer = require('./buyer/index')
router.use("/admin", admin);
router.use("/seller", seller);
router.use('/buyer',buyer)
router.use('/coverageArea',coverageArea);

router.get("/", (req, res) => {
	res.status(200).json({ message: "Connected!" });
});
module.exports = router;
