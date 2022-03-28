const router = require('express').Router()
const accountRouter = require('./account');
const productRouter = require('./product');

router.use('/account',accountRouter);
router.use('/product', productRouter);

module.exports = router