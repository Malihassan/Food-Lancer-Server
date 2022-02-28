const router = require('express').Router()
const productController = require('../../controllers/product')
router.get("/allProducts", productController.getAllProducts);
router.patch("/:id", productController.updateStatus);
router.get("/:id", productController.getOneProduct);

module.exports = router;
