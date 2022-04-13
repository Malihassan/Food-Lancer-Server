const router = require("express").Router();
const buyerAuthentication = require("../../middleware/buyerAuth");
const multer = require("../../middleware/multer");

const buyerController = require("../../controllers/buyer");

router.get("/info", buyerAuthentication, buyerController.buyerById);
router.get("/signup/confirm/:token/:id", buyerController.confirm);
router.post("/login", buyerController.login);
router.get(
	"/notification",
	buyerAuthentication,
	buyerController.getNotification
);
// router.get('/setOrderNotificationAsReaded',buyerAuthentication,buyerController.setNotificationForOrdersAsReaded);

router.post(
	"/signup",
	multer.single("image"),
	buyerController.checkBuyerAcountBeforeSignup,
	buyerController.signup
);
router.post("/forgetPassword", buyerController.forgetPassword);
router.patch(
	"/resetPassword",
	buyerAuthentication,
	buyerController.resetPassword
);

router.patch(
	"/update",
	buyerAuthentication,
	multer.single("image"),
	buyerController.updateBuyer
);
router.get("/logout", buyerAuthentication, buyerController.logout);

router.get("/paymentSuccess", buyerController.paymentSuccess);
router.get("/paymentCancel", buyerController.paymentCancel);

router.post(
	"/webhook",
	express.raw({ type: "application/json" }),
	buyerController.webhook
);

router.post(
	"/sendToPayment",
	buyerAuthentication,
	buyerController.sendToPayment
);

module.exports = router;
