const router = require('express').Router()
const productController = require('../../controllers/seller/product')

router.get('/',productController.getAllProducts)
router.patch('/:id',productController.updateStatus)

module.exports = router