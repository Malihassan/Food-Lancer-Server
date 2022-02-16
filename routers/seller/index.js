const router = require("express").Router();
const productRouter = require("./product");
const accountRouter = require('./account')

router.use("/product", productRouter);
router.use("/account", accountRouter)

module.exports = router;
