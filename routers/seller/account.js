const router = require("express").Router();
const sellerAuthentication = require("../../middleware/sellerAuth");

const sellerController = require("../../controllers/seller");
const coverageController = require("../../controllers/coverageArea")
router.post("/login", sellerController.login);
router.post("/signup", sellerController.signup);

router.get("/signup/confirm/:token/:id", sellerController.confirm);
router.post(
  "/forgetPassword",
  sellerAuthentication,
  sellerController.forgetPassword
);
router.patch("/edit", sellerAuthentication, sellerController.updateSeller);
router.get("/coverageArea", coverageController.getAllCoverageArea,);

module.exports = router;
