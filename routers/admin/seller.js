const express = require("express");
const router = express.Router();
const sellerController = require("../../controllers/admin/seller");
router.get(
  "/",
  sellerController.getSeller
);
module.exports = router;