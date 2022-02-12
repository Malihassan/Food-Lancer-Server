const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
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
   /* image: [
    {
      name: String,
    desc: String,
    img:
    {
        data: Buffer,
        contentType: String
    }
      
    }
    maxLenght:5
    
  ] , */
  price: {
    type: Number,
    required: true,
  },
  
    addOns: [
      {
        _id: mongoose.SchemaTypes.ObjectId,
        des: {
          type: String,
          required: true,
          trim: true
        },
        name: {
          type: String,
          required: true,
          trim: true
        },
        price: {
          type: Number,
          required: true,
          trim: true
        }
      }
    ],
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
              trim: true
            }
            /* ,
            createdAt: {
              type:Date,
              Default:new Date,
              required: true
            }  */
          },{timeStamp:true}
        ],
        rate: Number
      }
    ],
    avgRate: Number
},{timeStamp:true});

const ProductModel = mongoose.model("product",productSchema)
module.exports = ProductModel
//productModel.create({categoryId:23234242424,sellerId:321323234,description:"wdsdfsdfsdfsdfs",price:344,reviews:[{buyerId:23424,sellerId:321323234,comment:"erfefrererrge"}]})

