const express = require("express");
const router = express.Router();
const accountController = require("../../controllers/seller/account");
const AppError = require("../../helpers/ErrorClass");
const productRouter = require("./product");
router.use("/product", productRouter);
router.post("/login", async (req, res, next) => {
	const { email, password } = req.body;
	try {
		if (!email) return next(new AppError("allFieldsRequired"));
		if (!password) return next(new AppError("allFieldsRequired"));

		const token = await accountController.login(email, password);
		res.json({ token });
	} catch (error) {
		next(error);
	}
});

router.patch("/editProfile/:id", async function (req, res) {
	const { phone, password, firstName, lastName, coverageArea } = req.body;

	const seller = await accountController.updateSeller(
		req.params.id,
		phone,
		password,
		firstName,
		lastName,
		coverageArea
	);
	if (!seller) {
		res.status(404).send("seller not found");
	}
	if (seller === "No Area") {
		res.statusMessage = "This area is not being covered";
		res.status(404).json(seller);
	}
	res.statusMessage = "seller data updated successfully";
	res.status(201).json(seller);
});

module.exports = router;
