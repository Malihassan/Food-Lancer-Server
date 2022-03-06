const router = require("express").Router();
const product = require("./product");
const category = require("./category");
const orderRouter = require("./order");
const buyerRouter = require("./buyer");
const accountRouter = require("./account");
const sellerRouter = require("./seller");

router.use("/product", product);
router.use("/category", category);
router.use("/order", orderRouter);
router.use("/buyer", buyerRouter);
router.use("/account", accountRouter);
router.use("/seller", sellerRouter);
module.exports = router;
