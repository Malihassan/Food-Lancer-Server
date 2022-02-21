const express = require("express");
const router = express.Router();
const seller = require("./seller/index");
const coverageArea = require("./coverageArea/index");
// const buyer = require("./buyer/index");
const admin = require("./admin/index");

router.use("/seller", seller);
router.use('/address',coverageArea);
// router.use("/", buyer);
router.get("/", (req, res) => {
	res.status(200).json({ message: "Connected!" });
});

router.use("/admin", admin);

module.exports = router;
