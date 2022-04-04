const router = require("express").Router();
const buyerAuthentication = require("../../middleware/buyerAuth");
const orderController = require("../../controllers/order");

router.get("/myOrders",buyerAuthentication ,orderController.getOrdersForSpecificBuyer);

module.exports = router;
