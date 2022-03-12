const router = require("express").Router();
const productController = require("../../controllers/product");
const adminAuthentication = require("../../middleware/adminAuth");
router.get(
  "/allProducts",
  //adminAuthentication,
  productController.getAllProducts
);
router.patch("/:id", adminAuthentication, productController.updateStatus);
router.patch(
  "/:id/pending",
  adminAuthentication,
  productController.pendingMessage
);
router.get("/:id", adminAuthentication, productController.getOneProduct);
module.exports = router;
