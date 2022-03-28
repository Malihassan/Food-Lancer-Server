const router = require("express").Router();
const categoryController = require("../../controllers/category");
const sellerAuth=require('../../middleware/sellerAuth');
router.get('/allCategories',
sellerAuth,
categoryController.getCategories);
module.exports= router;