const router = require("express").Router();
const buyerController = require("../../controllers/buyer");
const adminAuth = require('../../middleware/adminAuth')
router.get("/allBuyers",adminAuth, buyerController.allBuyers);
router.get("/:id", buyerController.buyerById);
router.patch("/Buyerstatus/:id", buyerController.updateStatus);
router.get("/:id/orders", buyerController.getOrdersForSpecifcBuyer);

module.exports = router;
