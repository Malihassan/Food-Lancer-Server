const router = require('express').Router()
const product = require('./product')
const category = require('./category')
router.use('/product',product)
router.use('/category',category)

module.exports = router