const router = require("express").Router();
const accountRouter = require("./account");

router.use("/account", accountRouter);

module.exports = router;
