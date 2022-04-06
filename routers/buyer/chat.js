const chatController = require('../../controllers/chat')
const buyerAuth = require('../../middleware/buyerAuth')

const router = require('express').Router()

router.post('/sendMessage',buyerAuth,chatController.addMessage)
router.get('/getChat/:orderId/:buyerId/:sellerId' ,buyerAuth ,chatController.getChatForSpecificOrder)

module.exports = router