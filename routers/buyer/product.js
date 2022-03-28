const router = require("express").Router();
const buyerAuthentication = require("../../middleware/buyerAuth");
const productController = require("../../controllers/product");

router.get("/", buyerAuthentication, productController.getAllProducts)

router.get(
	"/:id",
	// buyerAuthentication,
	productController.getOneProduct
)

module.exports = router