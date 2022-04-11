const chatModel = require("../models/chat");
const sellerModel = require("../models/seller");
const buyerModel = require("../models/buyer");
const sellerController = require("../controllers/seller");
const addSeller = async (sellerId, socketId) => {
  if (sellerId) {
    await sellerModel.findByIdAndUpdate(sellerId, { $set: { socketId } });
  }
};
const addBuyer = async (buyerId, socketId) => {
  if (buyerId) {
    await buyerModel.findByIdAndUpdate(buyerId, { $set: { socketId } });
  }
};

const addMessage = async (req, res, next) => {
  const { sellerId, buyerId, orderId, message } = req.body;
  const from = req?.seller ? "seller" : "buyer";
  const result = await chatModel
    .findOneAndUpdate(
      { sellerId, buyerId, orderId },
      {
        $push: {
          messages: {
            content: message,
            from,
          },
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
    .populate("sellerId buyerId");
  const socketIds = [result.sellerId.socketId, result.buyerId.socketId];
  const io = req.app.get("io");
  socketIds.forEach((socketId) => {
    io.to(socketId).emit("receiveMessage", result.messages);
  });
  // const buyerData = await buyerModel.find({ _id: buyerId });
  // io.to(result.buyerId.socketId).emit(
  //   "receiveNotification",
  //   buyerData.notification
  // );
  next();
};

const getChatForSpecificOrder = async (req, res, next) => {
  const { sellerId, buyerId, orderId } = req.params;
  const result = await chatModel.findOne({ sellerId, buyerId, orderId });
  res.json(result);
};

module.exports = {
  addSeller,
  addBuyer,
  addMessage,
  getChatForSpecificOrder,
};
