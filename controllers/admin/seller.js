const sellerModel = require("../../models/seller");
const AppError = require("../../helpers/ErrorClass");
const getSeller = async (req, res, next) => {
const {status} = req.params
  const data = await sellerModel.find({status});
  if (data.length === 0) {
    return next(new AppError("noSellerFound"));
  }
  res.json(data)
};

const updateSeller = function(req, res, next){
  const {id} = req.params;
  const {status} = req.body;
  _editSeller(id, status).then(() =>{
      res.send('edited successfuly');
  }).catch(()=>{
      next(new AppError('UnauthorizedError'));
  })
}

const _editSeller = function(id, status){
  const options = {runValidators: true, new: true};
  return sellerModel.findOneAndUpdate({_id: id}, {status}, options);
}

module.exports = {
  getSeller,
  updateSeller
}