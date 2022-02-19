const router = require("express").Router();
const orderRouter=require('./order')
router.use("/admin/buyer/", orderRouter);


module.exports = router;
