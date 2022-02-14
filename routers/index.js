const express = require('express');
const router = express.Router()

// router.use('/admin',admins)
// router.use('/sellser', sellers);
// router.use('/buyer', buyers);

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

module.exports =router