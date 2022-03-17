const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
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
			enum: ["in progress", "delivered", "canceled"],
		},
	},
	{ timestamps: true }
);
orderSchema.plugin(mongoosePaginate);
const OrderModel = mongoose.model("order", orderSchema);

module.exports = OrderModel;
