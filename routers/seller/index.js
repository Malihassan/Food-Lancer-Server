const router = require("express").Router();
const productRouter = require("./product");
const accountRouter = require("./account");
const categoryRouter=require('./category');
const orderRouter = require('./order');
const chatRouter = require ('./chat')
router.use("/category",categoryRouter );
router.use("/account", accountRouter);
router.use("/product", productRouter);
router.use('/order',orderRouter)
router.use('/chat',chatRouter)


module.exports = router;
