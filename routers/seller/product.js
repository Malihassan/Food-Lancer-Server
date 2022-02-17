const express = require("express");
const productController = require("../../controllers/seller/product");
const router = express.Router();
const sellerAuthentication = require("../../middleware/sellerAuth");
router.post("/product/addProduct", (req, res, next) => {
	const body = req.body;
	productController.addProduct(body, `Pizza`).then((data) => {
		console.log(data);
		if (!data) {
			return res.status(404).json("category not found");
		}
		res.json(data);
	});
});
router.delete("/product/:id", (req, res, next) => {
	const { id } = req.params;
	productController.deleteProduct(id).then((data) => {
		console.log(data);
		if (!data || data == "undefind") {
			return res.status(404).json({ error: "ID not found" });
		}
		res.json("done");
	});
});

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
