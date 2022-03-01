const router = require("express").Router();
const orderController = require("../../controllers/order");
const adminAuth = require('../../middleware/adminAuth')
router.get("/allOrders",adminAuth, orderController.getAllOrders);
router.get("/filteredOrders",adminAuth, orderController.getOrdersForSpecificQuery);
//get Specific order
module.exports = router;
