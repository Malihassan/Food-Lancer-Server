const router = require("express").Router();
const buyerAuthentication = require("../../middleware/buyerAuth");
const orderController = require("../../controllers/order");

router.get("/myOrders",buyerAuthentication ,orderController.getOrdersForSpecificBuyer);
// router.post("/add", buyerAuthentication, orderController.addOrder)

module.exports = router;
