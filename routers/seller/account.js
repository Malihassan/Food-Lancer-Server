const router = require("express").Router();
const accountController = require("../../controllers/seller/account");
const AppError = require("../../helpers/ErrorClass");
const sellerAuthentication = require("../../middleware/sellerAuth");

router.post("/signup", accountController.signup);
router.get("/signup/confirm/:token/:id", accountController.confirm);
router.post("/login", accountController.login);
router.post("/forgetPassword", accountController.forgetPassword);

router.patch("/edit", sellerAuthentication, accountController.updateSeller);

module.exports = router;
