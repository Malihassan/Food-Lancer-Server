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

module.exports = {
  addSeller,
  addBuyer,
};
