const express = require('express');
const router = express.Router()
const seller = require('./seller/index');
// const buyer = require('./buyer/index');
const admin=require('./admin/index');
router.use('/admin',admin);
router.use('/seller', seller);
// router.use('/', buyer);
router.get('/',(req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

module.exports =router