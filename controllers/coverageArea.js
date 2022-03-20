const AppError = require("../helpers/ErrorClass");
const coverageAreaModule = require("../models/coverageArea");

const createCoverageArea = (req, res, next) => {
  coverageAreaModule
    .create(req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((e) => res.status(400).json(e.message));
};

const deleteCoverageArea = async (req, res, next) => {
  const { id } = req.params;
  const elemDeleted = await coverageAreaModule.findOneAndDelete({ _id: id });
  if (!elemDeleted) {
    return next(new AppError("accountNotFound"));
  }
  res.json("Deleted Sucseefuly");
};

async function CountOfCoverageAreaModules() {
  return await coverageAreaModule.count({});
}

const displayAllCoverageArea = async (req, res, next) => {
  const { page, searchValue} = req.query;
  let coverageAreas;
  let count;
  const pageSize = 8;
  if (searchValue) {
    coverageAreas = await coverageAreaModule
      .find({$or: [
        { 'governorateName': searchValue },
        { 'regionName': searchValue }
      ]})
      .skip(pageSize * (page - 1))
      .limit(pageSize);
  count = coverageAreas.length;
  } else {
    coverageAreas = await coverageAreaModule
      .find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
      count = await CountOfCoverageAreaModules();
  }
  res.json({ coverageAreas, countOfCoveragArea: count });
};

module.exports = {
  createCoverageArea,
  deleteCoverageArea,
  displayAllCoverageArea,
};
