const coverageAreaModule = require('../models/coverageArea');
const create = (req, res, next) => {
    coverageAreaModule.create(req.body)
    .then((data) => {
        res.json(data)
      }).catch(e => res.status(401).json(e.message))
}

module.exports = {
    create
}