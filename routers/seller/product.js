const express = require("express");
const router = express.Router();
const productController = require("../../controllers/seller/product");
const AppError = require("../../helpers/ErrorClass");
const sellerAuthentication = require("../../middleware/sellerAuth");

router.post("/addProduct", sellerAuthentication, productController.addProduct);
router.delete("/:id", sellerAuthentication, productController.deleteProduct);
router.get(
  "/",
  sellerAuthentication,
  productController.getProductsForSpecifcSeller
);
router.patch(
  "/:id",
  sellerAuthentication,
  productController.updateProductForSpecifcSeller
);
module.exports = router;
