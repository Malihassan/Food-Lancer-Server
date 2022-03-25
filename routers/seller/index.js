const router = require("express").Router();
const productRouter = require("./product");
const accountRouter = require("./account");
const categoryRouter=require('./category');
router.use("/product", productRouter);
router.use("/account", accountRouter);
router.use("/category",categoryRouter );

module.exports = router;
