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
	},
	{ timeStamp: true }
);

const ChatModel = mongoose.model("Chat", chatSchema);
module.exports = ChatModel;
