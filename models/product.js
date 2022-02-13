const mongoose = require("mongoose");
const productSchema = mongoose.Schema(
  {
    categoryId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "category",
      required: true,
    },
    sellerId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "seller",
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: [
      {
        url: String
      },
    ],

    ////maxLenght

    price: {
      type: Number,
      required: true,
    },
    /*addOns: [
      {
        _id: mongoose.SchemaTypes.ObjectId,
        des: {
          type: String,
          required: true,
          trim: true,
        },
        name: {
          type: String,
          required: true,
          trim: true,
        },
        price: {
          type: Number,
          required: true,
          trim: true,
        },
      },
    ],*/
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
        comments: [
          {
            message: {
              type: "String",
              required: true,
              trim: true,
            },

            createdAt: {
              type: Date,
              default: new Date(),
            },
          },
        ],
        rate: Number,
      },
    ],
    avgRate: Number,
  },
  { timeStamp: true }
);
const ProductModel = mongoose.model("product", productSchema);
productSchema.path('image')
    .validate((img) => img.length < 5,  'Must have maxmum 5 images');
module.exports = ProductModel;
//productModel.create({ price: 3434 });
