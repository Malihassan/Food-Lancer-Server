const chatController = require('../../controllers/chat')
const buyerAuth = require('../../middleware/buyerAuth')

const router = require('express').Router()

router.post('/sendMessage',buyerAuth,chatController.addMessage)


module.exports = router