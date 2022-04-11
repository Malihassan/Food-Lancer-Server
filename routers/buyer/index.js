const router = require('express').Router()
const accountRouter = require('./account')
const orderRouter = require('./order')
const productRouter = require('./product')
const chatRouter = require ('./chat')

router.use('/account',accountRouter)
router.use('/order',orderRouter)
router.use('/product',productRouter)
router.use('/chat',chatRouter)
module.exports = router;
