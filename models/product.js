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
        url: String,
      },
    ],
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
  { timestamps: true }
);
const ProductModel = mongoose.model("product", productSchema);
productSchema
  .path("image")
  .validate((img) => img.length < 5, "Must have maxmum 5 images");
module.exports = ProductModel;

 
/*const productmodel=require("./models/product")
 app.post("/add",(req,res)=>{
  console.log(req.body);
const {categoryId,sellerId,description,image,price,addOns,reviews,avgRate}= req.body
productmodel.create({categoryId,sellerId,description,image,price,addOns,reviews,avgRate});
res.json("done")
=======
app.use('/',routers)
app.use(errorHandler)
app.listen(process.env.PORT,()=>{
    console.log(`listen on port ${process.env.PORT}`);
>>>>>>> 58c53ab0aaa55764d69f00d7103b4aa743b7b2ba
})
 */
