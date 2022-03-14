const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
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
		products: [
			{
				_id: {
					type: mongoose.SchemaTypes.ObjectId,
					ref: "product",
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
				},
			},
		],
		totalPrice: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			default: "in progress",
			enum: ["in progress", "done", "cancel"],
		},
	},
	{ timestamps: true }
);

const OrderModel = mongoose.model("order", orderSchema);

module.exports = OrderModel;
