function authMiddleware(req, res, next) {
  // just a simulation of getting user
  req.user = {
    id: req.headers.authorization,
  }

  next()
}

module.exports = { authMiddleware }
