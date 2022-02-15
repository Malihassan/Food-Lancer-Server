const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
	{
		buyerId: {
			type: mongo.SchemaTypes.ObjectId,
			ref: "buyer",
			required: true,
		},
		sellerId: {
			type: mongo.SchemaTypes.ObjectId,
			ref: "seller",
			required: true,
		},
		messages: [
			{
				content: {
					type: "String",
					trim: true,
				},
				createdAt: {
					type: Date,
					immutable: true,
					default: () => new Date(),
				},
			},
		],
		productId: {
			type: mongo.SchemaTypes.ObjectId,
			ref: "product",
			required: true,
		},
	},
	{ timeStamp: true }
);

const ChatModel = mongo.model("Chat", chatSchema);
module.exports = ChatModel;
