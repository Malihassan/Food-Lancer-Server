const router = require("express").Router();
//const productRouter = require("./product");
//const accountRouter = require("./account");
const sellerRouter = require("./seller");
//router.use("/product", productRouter);
//router.use("/account", accountRouter);
router.use("/seller", sellerRouter);
module.exports = router;
