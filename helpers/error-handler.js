function errorHandler(err, req, res, next) {
  if (Object.keys(err).every((e) => ["status","message"].includes(e))) {
    // custom application error
    return res.status(err.status).json({ message: err.message });
  }
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ error: "Unauthorized !" });
  }
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Invalid Token !" });
  }
  if (err.name === 'accountNotFound') {
    return res.status(404).json({ error: "ID not found !" });
  }
  if (err.name === 'emailNotFound') {
    return res.status(404).json({ error: "Email not founded !" });
  }
  if (err.name === 'InvalidPassword') {
    return res.status(404).json({ error: "Invalid Email or Password !" });
  }
  if (err.name === 'allFieldsRequired') {
    return res.status(400).json({ error: "All fields are required !" });
  }
  if (err.name === 'reviewAlreadyAdded') {
    return res.status(304).json({ error: "this product already have review !" });
  }
  if (err.name === 'categoryNotFound') {
    return res.status(404).json({ error: "Category not available !" });
  }
  if (err.name === 'noSellerFound') {
    return res.status(404).json({ error: "Sellers not found !" });
  }
  if (err.name === 'noProductFound') {
    return res.status(404).json({ error: "Product not found !" });
  } 
  if (err.name === 'noCoverageAreaFound') {
    return res.status(404).json({ error: "coverageAreas is Empty !" });
  }
  if (err.name === 'noBuyerFound') {
    return res.status(404).json({ error: "Buyers not found !" });
  }
  if (err.name === 'CategoryMustUniqe') {
    return res.status(404).json({ error: "category must be unique" });
  }
  if (err.name === 'pendindStatusEmail') {
    return res.status(404).json({ error: "Please Confirm Your Email" });
  }
  if (err.name === 'sellerUniqueFileds') {
    return res.status(400).json({ error: "Phone or Email or UserName Is Exist" });
  }
  
}
module.exports = errorHandler;
