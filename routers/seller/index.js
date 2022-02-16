const express = require("express");
const router = express.Router();
const accountController = require("../../controllers/seller/account");
const AppError = require("../../helpers/ErrorClass");
const productRouter=require('./product');
router.use('/product',productRouter);
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

	const user = await accountController.updateSeller(
		req.params.id,
		phone,
		password,
		firstName,
		lastName,
		coverageArea
	);
	if (!user) {
		res.status(404).send("seller not found");
	}
	if (user === "No Area") {
		res.statusMessage = "This area is not being covered";
		res.status(404).json(user);
	}
	res.statusMessage = "seller data updated successfully";
	res.status(201).json(user);
});

module.exports = router;
