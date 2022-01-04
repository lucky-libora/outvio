const createError = require('http-errors')

function notFoundHandler(req, res, next) {
  next(createError(404))
}

module.exports = { notFoundHandler }
