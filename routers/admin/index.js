const router = require("express").Router();
const orderRouter=require('./order')
router.use("/buyer/", orderRouter);


module.exports = router;
