const chatController = require('../../controllers/chat');
const sellerController = require('../../controllers/seller')
const buyerController = require('../../controllers/buyer')

const buyerAuth = require('../../middleware/buyerAuth')

const router = require('express').Router()

router.post('/sendMessage',buyerAuth,chatController.addMessage ,sellerController.addNotificationToSellerForRecieveMesseageFromBuyer)
router.patch('/setMessgeAsReaded',buyerAuth,buyerController.setNotificationMessageAsReaded)
router.get('/getChat/:orderId/:buyerId/:sellerId' ,buyerAuth ,chatController.getChatForSpecificOrder)

module.exports = router