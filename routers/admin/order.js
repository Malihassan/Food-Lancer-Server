const router = require("express").Router();
const orderController = require("../../controllers/order");

router.get("/allOrders", orderController.getAllOrders);
router.get("/filteredOrders", orderController.getOrdersForSpecificQuery);

module.exports = router;
