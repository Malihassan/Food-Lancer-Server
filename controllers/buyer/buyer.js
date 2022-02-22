const AppError = require("../../helpers/ErrorClass");
const buyerModel = require("../../models/buyer");

const allBuyers = async (req, res, next) => {
  try {
    const buyers = await buyerModel
      .find(
        {},
        {
          password: 0,
          token: 0,
          confirmationCode: 0,
          status: 0,
          createdAt: 0,
          updatedAt: 0,
        }
      )
      .populate({ path: "fav", select: "name" });
    res.json(buyers);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const buyerById = async (req, res, next) => {
  const { id } = req.params;
  const buyer = await buyerModel
    .findById(id)
    .populate({ path: "fav", select: "name" })
    .catch((error) => {
      res.status(400).json(error.message);
    });
  if (!buyer) {
    return next(new AppError("accountNotFound"));
  }
  res.json(buyer);
};

const updateStatus = async (req, res, next) => {
  const { status } = req.body;
  const { id } = req.params;
  try {
    const updated = await buyerModel.findOneAndUpdate(
      { _id: id },
      { status },
      { runValidators: true, new: true }
    );
    if (!updated) {
      return next(new AppError("accountNotFound"));
    }
    res.json({ message: "updated" });
  } catch (error) {
    res.status(400).json(error.message);
  }
};
const getOrdersForSpecifcBuyer = (req, res, next) => {
  const {id}=req.params;
  orderModel.find({ buyerId:id }).populate({path:'sellerId',select:'userName firstName lastName phone email status gender -_id'}).populate({
    path: "products", 
    populate: {
       path: "_id" ,
       select:'name description image price addOns reviews avgRate status -_id'
    }
 })
  .then(data=>{
    if (!data) {
      return next(new AppError('accountNotFound')); 
    }
    res.json(data)
    })
}

module.exports = { updateStatus, allBuyers, buyerById ,getOrdersForSpecifcBuyer};
