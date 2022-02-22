const router = require("express").Router();
const orderController = require("../../controllers/admin/order");

router.get("/allOrders", orderController.getAllOrders);
// router.get("/filteredOrders", orderController.getOrdersForSpecificParams);

module.exports = router;
