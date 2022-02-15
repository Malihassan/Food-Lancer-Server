function errorHandler(err, req, res, next) {
  if (Object.keys(err).every((e) => ["status","message"].includes(e))) {
    // custom application error
    return res.status(err.status).json({ message: err.message });
  }
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Invalid Token" });
  }
  if (err.name === 'accountNotFound') {
    return res.status(404).json({ error: "ID not found" });
  }
}
module.exports = errorHandler;
