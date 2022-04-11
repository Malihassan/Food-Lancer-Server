const chatController = require("../../controllers/chat");
const sellerController = require('../../controllers/seller')
const buyerController = require('../../controllers/buyer')

const sellerAuth = require("../../middleware/sellerAuth");

const router = require("express").Router();

router.post("/sendMessage", sellerAuth, chatController.addMessage,buyerController.addNotificationToBuyerForRecieveMesseageFromSeller);
router.patch('/setMessgeAsReaded',sellerAuth,sellerController.setMessageAsReaded)
router.get('/getChat/:orderId/:buyerId/:sellerId' ,sellerAuth ,chatController.getChatForSpecificOrder)
module.exports = router;
