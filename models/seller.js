const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const sellerSchema = mongoose.Schema(
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
    image:{
			url: String,
		  },
    password: {
      type: String,
			match: [/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/g, "Please fill a valid password"],
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
    rate: {
      type: Number,
      default: 0,
    },
    token: {
      type: String,
      default: "",
    },
    "coverageArea": {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "coverageArea",
      required: true,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["active", "pending", "blocked"],
    },
    confirmationCode: {
      type: Number,
      default: 0,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
  },
  { timestamps: true }
);
sellerSchema.plugin(mongoosePaginate);

sellerSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
  next();
});
sellerSchema.methods.comparePassword = function (password) {
  const that = this;
  return bcrypt.compareSync(password, that.password);
};
const sellerModel = mongoose.model("seller", sellerSchema);
module.exports = sellerModel;
