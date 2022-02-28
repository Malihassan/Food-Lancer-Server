const router = require("express").Router();
const coverageRouter = require("./coverage-area");

router.use("/", coverageRouter);

module.exports = router;
