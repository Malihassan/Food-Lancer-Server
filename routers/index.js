const express = require('express');
const router = express.Router()
const seller = require('./seller/index');
const admins = require('./admin/admin');
 router.use('/admin',admins)
router.use('/seller', seller);
// router.use('/buyer', buyers);
router.get('/',(req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

module.exports =router