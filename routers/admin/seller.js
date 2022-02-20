const express = require("express");
const router = express.Router();
const sellerController = require("../../controllers/admin/seller");
const adminAuthentication = require("../../middleware/adminAuth")
router.get(
  "/:status",
  adminAuthentication, 
  sellerController.getSeller
);
module.exports = router;