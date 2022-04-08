const chatController = require('../../controllers/chat');
const sellerController = require('../../controllers/seller')
const buyerAuth = require('../../middleware/buyerAuth')

const router = require('express').Router()

router.post('/sendMessage',buyerAuth,chatController.addMessage ,sellerController.addNotificationToSellerForRecieveMesseageFromBuyer)
router.get('/getChat/:orderId/:buyerId/:sellerId' ,buyerAuth ,chatController.getChatForSpecificOrder)

module.exports = router