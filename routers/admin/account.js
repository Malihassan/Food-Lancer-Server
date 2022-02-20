const router = require("express").Router();
const accountController = require("../../controllers/admin/account");

router.post("/login", accountController.login);
router.post("/signup", accountController.signup);

module.exports = router;
