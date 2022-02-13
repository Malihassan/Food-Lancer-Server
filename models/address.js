const mongoose = require("mongoose");
const addressSchema = mongoose.Schema(
    {
        governorateName:
        {
            type: String,
            default: "Assiut",
            trim: true,
            enum: ["Assiut"]
        },
        regionName:
            [
                {
                    _id: mongoose.SchemaTypes.ObjectId,
                    name: {
                        type: String,
                        required: true,
                        trim: true,
                        lowercase: true
                    },
                }
            ]
    },
    { timestamps: true }
);

const addressModel = mongoose.model("address", addressSchema);
module.exports = addressModel;
