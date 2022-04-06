const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    buyerId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "buyer",
      required: true,
    },
    sellerId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "seller",
      required: true,
    },
    messages: [
      {
        from: {
          type: String,
          trim: true,
          required: true,
          enum: ["seller", "buyer"],
        },
        content: {
          type: String,
          trim: true,
        },
        createdAt: {
          type: Date,
          immutable: true,
          default: () => new Date(),
        },
      },
    ],
    orderId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "order",
      required: true,
    },
  },
  { timestamps: true }
);

const ChatModel = mongoose.model("Chat", chatSchema);
module.exports = ChatModel;
