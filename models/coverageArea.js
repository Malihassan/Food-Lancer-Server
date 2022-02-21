const mongoose = require("mongoose");
const coverageAreaSchema = mongoose.Schema(
    {
        governorateName:
        {
            type: String,
            trim: true,
            unique: true,
            required: true
        },
        regionName:
            [
                {
                    name: {
                        type: String,
                        trim: true,
                        unique: true,
                        lowercase: true,
                        required: true
                    },
                }
            ]
    },
    { timestamps: true }
);


const coverageAreaModel = mongoose.model("coverageArea", coverageAreaSchema);
module.exports = coverageAreaModel;
