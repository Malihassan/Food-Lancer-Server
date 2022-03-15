const router  = require('express').Router()
const categoryController = require('../../controllers/category')

router.post('/',categoryController.addCategory)
router.patch('/:id',categoryController.updateCategory)
router.get('/all',categoryController.getCategories)
router.get('/:id',categoryController.getSpecificCategory)
router.delete('/:id',categoryController.deleteCategory)
module.exports = router