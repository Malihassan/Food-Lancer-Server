const router = require("express").Router();
const accountController = require("../../controllers/seller/account");
const AppError = require("../../helpers/ErrorClass");
const sellerAuthentication = require("../../middleware/sellerAuth");


router.post("/signup", accountController.signup);

router.get("/signup/confirm/:token/:id", accountController.confirm);

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

router.patch(
	"/edit/:id",
	sellerAuthentication,
	async function (req, res, next) {
		const { id } = req.seller;
		const { phone, password, firstName, lastName, coverageArea } = req.body;
		accountController
			.findOneAndUpdate(
				{ _id: id },
				{ phone, password, firstName, lastName, coverageArea },
				{ new: true, runValidators: true }
			)
			.then((data) => {
				if (!data) {
					return next(new AppError("allFieldsRequired"));
				}
				res.json(data);
			})
			.catch((e) => res.status(400).json(e.message));
	}
);

module.exports = router;
