const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true
        },
        categoryImg: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const categoryModel = mongoose.model("category", categorySchema);

module.exports = categoryModel;
