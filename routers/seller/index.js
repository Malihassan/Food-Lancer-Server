const router = require("express").Router();
const productRouter = require("./product");
const accountRouter = require("./account");
const orderRouter = require('./order');

router.use("/account", accountRouter);
router.use("/product", productRouter);
router.use('/order',orderRouter)

module.exports = router;
