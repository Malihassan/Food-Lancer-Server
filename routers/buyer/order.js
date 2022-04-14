const router = require("express").Router();
const buyerAuthentication = require("../../middleware/buyerAuth");
const sellerController = require("../../controllers/seller");
const buyerController = require("../../controllers/buyer");
const orderController = require("../../controllers/order");

router.get("/myOrders",buyerAuthentication ,orderController.getOrdersForSpecificBuyer);
router.post("/add", buyerAuthentication, orderController.addOrder,sellerController.addNotificationToSellerForAddOrder,buyerController.addNotificationToBuyer)
router.get("/notifications",buyerAuthentication,buyerController.getNotificationsForBuyer)
router.get('/setOrderNotificationAsReaded',buyerAuthentication,buyerController.setNotificationForOrdersAsReaded);
router.patch("/status",buyerAuthentication,orderController.updateOrderStatusForSeller)
module.exports = router;
