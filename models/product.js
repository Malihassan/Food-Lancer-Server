const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
var uniqueValidator = require('mongoose-unique-validator');
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
      unique:true,
    },
    description: {
      type: String,
      required: tgi true,
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
        orderId: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "order",
          required: true,
        },
        comments: {
          type: String,
          required: true,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: new Date(),
        },
        rate: { type: Number, default: 0 },
      },
    ],
    avgRate: {type:Number},
  },
  { timestamps: true }
);
productSchema.plugin(mongoosePaginate);
productSchema.plugin(uniqueValidator, { message: 'expected {PATH} to be unique.' });
const ProductModel = mongoose.model("product", productSchema);
// findByIdAndUpdate
// productSchema.pre('findOneAndUpdate', function (next, done) {
  // var self = this;
  // console.log('exercise:', self); // returns Query object instead of exercise object
  // some validations here
//  const avg=db.productSchema.aggregate({$avg:"$reviews.rate"})
//  console.log(avg,"avgaaa");
//  next();
// });
productSchema
  .path("image")
  .validate((img) => img.length < 5, "Must have maxmum 5 images");
module.exports = ProductModel;
