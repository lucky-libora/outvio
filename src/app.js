require('dotenv').config()
const express = require('express')
const logger = require('morgan')
const indexRouter = require('./routes')
const { notFoundHandler } = require('./handlers/not-found-handler')
const { errorsHandler } = require('./handlers/errors-handler')
const { ipRateLimiterMiddleware, userRateLimiterMiddleware } = require('./middlewares/rate-limiter')
const { authMiddleware } = require('./middlewares/auth')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(ipRateLimiterMiddleware)
app.use(authMiddleware)

app.use(userRateLimiterMiddleware)

app.use('/', indexRouter)

// catch 404 and forward to error handler
app.use(notFoundHandler)
app.use(errorsHandler)

module.exports = app
