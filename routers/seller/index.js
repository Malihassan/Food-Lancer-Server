const express = require("express");
const router = express.Router();
const accountController = require("../../controllers/seller/account");
const AppError = require("../../helpers/ErrorClass");

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

module.exports = router;
