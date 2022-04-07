const chatModel = require("../models/chat");
const sellerModel = require("../models/seller");
const buyerModel = require("../models/buyer");

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
  const socket = req.app.get("socketio");
  console.log(result.sellerId.socketId, result.buyerId.socketId);
  socket.broadcast.to([result.buyerId.socketId,result.sellerId.socketId]).emit("receiveMessage", result);

  // switch (from) {
  //   case "seller":
  //     io.broadcast.to([result.buyerId.socketId,]).emit("receiveMessage", result);
  //     break;
  //   case "buyer":
  //     io.broadcast.to(result.sellerId.socketId).emit("receiveMessage", result);
  //     break;
  // }
  res.json();
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
