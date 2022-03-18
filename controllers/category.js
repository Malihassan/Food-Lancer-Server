const AppError = require("../helpers/ErrorClass");
const categoryModel = require("../models/category");

const addCategory = async (req, res, next) => {
  try {
    const { categoryImg="test", name } = req.body;
    await categoryModel.create({ categoryImg, name });
    res.status(201).json({ message: "created category" });
  } catch (error) {
    if (error.code === 11000) {
      return next(new AppError('CategoryMustUniqe'));
    }
    res.status(400).json({ error: error.message });
  }
};
const updateCategory = async (req, res, next) => {
  const { id } = req.params;
  const { name, categoryImg='test' } = req.body;
  try {
    const category = await categoryModel.findOneAndUpdate(
      { _id: id },
      { name, categoryImg },
      { new: true, runValidators: true }
    );
    if (!category) {
      return next(new AppError("accountNotFound"));
    }
    res.json({ message: "updated Category" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getCategories = async (req, res, next) => {
  const category = await categoryModel.find();
  res.json(category);
};
const getSpecificCategory = async (req,res,next)=>{
  const category = await categoryModel.findById(req.params.id)
  if (!category) {
    return next(new AppError("accountNotFound"));
  }
  res.json(category)
}
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findByIdAndDelete(id);
    if (!category) {
      return next(new AppError("accountNotFound"));
    }
    res.json({ message: "category is deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  getSpecificCategory
};
