const router = require('express').Router()
const accountRouter = require('./account')
const orderRouter = require('./order')
const productRouter = require('./product')
router.use('/account',accountRouter)
router.use('/order',orderRouter)
router.use('/product',productRouter)

module.exports = router;
