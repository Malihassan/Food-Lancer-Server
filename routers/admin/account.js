const router = require("express").Router();
const accountController = require("../../controllers/admin/account");
const adminAuth = require('../../middleware/adminAuth');

router.post("/login", accountController.login);
router.post("/signup", accountController.signup);
router.patch('/update/:id', adminAuth, accountController.update);

module.exports = router;
