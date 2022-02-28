const router  = require('express').Router()
const categoryController = require('../../controllers/category')

router.post('/',categoryController.addCategory)
router.patch('/:id',categoryController.updateCategory)
router.get('/',categoryController.getCategories)
router.delete('/:id',categoryController.deleteCategory)
module.exports = router