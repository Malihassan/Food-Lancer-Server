const chatController = require("../../controllers/chat");
const sellerAuth = require("../../middleware/sellerAuth");

const router = require("express").Router();

router.post("/sendMessage", sellerAuth, chatController.addMessage);
router.get('/getChat/:orderId/:buyerId/:sellerId' ,sellerAuth ,chatController.getChatForSpecificOrder)
module.exports = router;
