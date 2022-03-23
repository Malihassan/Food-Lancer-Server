const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const productSchema = mongoose.Schema(
  {
    categoryId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "category",
      required: true,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["active", "pending", "blocked"],
    },
    pendingMessage: {
      type: String,
    },
    sellerId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "seller",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: [
      {
        _id: String,
        url: String,
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    reviews: [
      {
        _id: mongoose.SchemaTypes.ObjectId,
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
        comments: { type: "String", required: true, trim: true },
        createdAt: {
          type: Date,
          default: new Date(),
        },
        rate: Number,
      },
    ],
    avgRate: Number,
  },
  { timestamps: true }
);
productSchema.plugin(mongoosePaginate);
const ProductModel = mongoose.model("product", productSchema);
productSchema
  .path("image")
  .validate((img) => img.length < 5, "Must have maxmum 5 images");
module.exports = ProductModel;
