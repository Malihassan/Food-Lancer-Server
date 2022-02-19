const router = require("express").Router();
const orderRouter = require("./order");
const accountRouter = require("./account");

router.use("/buyer/", orderRouter);
router.use("/account", accountRouter);

module.exports = router;
