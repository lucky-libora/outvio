// eslint-disable-next-line no-unused-vars
function errorsHandler(err, req, res, next) {
  const resBody = {
    message: err.message,
  }

  if (process.env.NODE_ENV === 'development') {
    resBody.stack = err.stack
  }

  res.status(err.status || 500)
  res.send(resBody)
}

module.exports = { errorsHandler }
