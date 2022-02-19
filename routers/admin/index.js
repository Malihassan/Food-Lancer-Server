const router = require("express").Router();
const product = require("./product");
const category = require("./category");
const orderRouter = require("./order");
const accountRouter = require("./account");

router.use("/product", product);
router.use("/category", category);
router.use("/buyer", orderRouter);
router.use("/account", accountRouter);

module.exports = router;
