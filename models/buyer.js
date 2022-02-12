const mongoose = require("mongoose");

const buyerSchema = mongo.Schema(
  {
    userName: {
      type: String,
      minLength: [5, "Must be at least 5"],
      maxlength: [20, "Must be at latest 20"],
      trim: true,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      minLength: [3, "Must be at least 3"],
      maxLength: [20, "Must be at latest 20"],
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      minLength: [3, "Must be at least 3"],
      maxLength: [20, "Must be at latest 20"],
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      match: [/^01[0125]\d{1,8}/g, "Please fill a valid Phone Number"],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    token: String,
    address: {
      type: mongo.SchemaTypes.ObjectId,
      ref: "address",
    },
    status: {
      type: String,
      default: "pending",
      enum: ["active", "pending", "blocked"],
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    reviews: [
      {
        _id: mongo.SchemaTypes.ObjectId,
        sellerId: {
          type: mongo.SchemaTypes.ObjectId,
          ref: "seller",
          required: true,
        },
        message: {
          type: String,
          trim: true,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    fav: [mongo.SchemaTypes.ObjectId],
  },
  { timestamps: true }
);

const buyerModel = mongo.model("buyer", buyerSchema);
module.exports = buyerModel;
