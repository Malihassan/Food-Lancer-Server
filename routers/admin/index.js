const router = require("express").Router();
const orderRouter = require("./order");
const accountRouter = require("./account");
const sellerRouter = require("./seller");
router.use("/buyer/", orderRouter);
router.use("/account", accountRouter);
router.use("/seller", sellerRouter);

module.exports = router;
