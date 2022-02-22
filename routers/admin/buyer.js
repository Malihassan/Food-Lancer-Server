const router = require("express").Router();
const buyerController = require("../../controllers/buyer/buyer");
// const adminAuth = require('../../middleware/adminAuth')


router.get("/all", buyerController.allBuyers);
router.get("/:id", buyerController.buyerById);
router.patch("/:id/status", buyerController.updateStatus);
router.get("/:id/orders", buyerController.getOrdersForSpecifcBuyer);

module.exports = router;
