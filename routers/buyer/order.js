const router = require("express").Router();
const buyerAuthentication = require("../../middleware/buyerAuth");
const sellerController = require("../../controllers/seller");
const buyerController = require("../../controllers/buyer");

const orderController = require("../../controllers/order");
router.get("/myOrders",buyerAuthentication ,orderController.getOrdersForSpecificBuyer);
router.post("/add", buyerAuthentication, orderController.addOrder,sellerController.addNotificationToSellerForAddOrder)

module.exports = router;
