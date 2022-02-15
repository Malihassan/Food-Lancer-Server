const mongoose = require("mongoose");
const coverageAreaSchema = mongoose.Schema(
    {
        governorateName:
        {
            type: String,
            default: "Assiut",
            trim: true,
            enum: ["Assiut"],
            unique:true
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


const coverageAreaModel = mongoose.model("coverageArea", coverageAreaSchema);
module.exports = coverageAreaModel;
