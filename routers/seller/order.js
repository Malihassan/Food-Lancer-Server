const express = require("express");
const router = express.Router();
const orderController = require("../../controllers/order");
const sellerController = require("../../controllers/seller");
const buyerController= require('../../controllers/buyer')
const sellerAuthentication = require("../../middleware/sellerAuth");

router.get("/myOrders", sellerAuthentication, orderController.getOrders);
router.patch(
  "/status",
  sellerAuthentication,
  orderController.updateOrderStatusForSeller,
  sellerController.setNotificationOrderAsReaded,
  buyerController.addNotificationToBuyerForChangeOrderStatus
);
module.exports = router;
// addNotificationToBuyerForChangeOrderStatus
//setorderasreadedfor
