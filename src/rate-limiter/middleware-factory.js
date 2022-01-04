const { RateLimiterRedis } = require('rate-limiter-flexible')
const { redisClient } = require('../redis')
const { getEndpointWeight } = require('./helpers')

const limit = parseInt(process.env.RATE_LIMITER_LIMIT)
const duration = parseInt(process.env.RATE_LIMITER_DURATION_IN_SECONDS)

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rate_limiter:',
  points: limit,
  duration,
})

function createRateLimiterMiddleware(keyGetter) {
  return async (req, res, next) => {
    try {
      const key = keyGetter(req)
      if (!key) {
        return next()
      }

      const weight = getEndpointWeight(req.url)
      await rateLimiter.consume(key, weight)
      next()
    } catch (err) {
      res.status(429).send({
        message: 'Too Many Requests',
        currentUsage: err.consumedPoints,
        usageLimit: limit,
        resetDate: new Date(Date.now() + err.msBeforeNext),
      })
    }
  }
}

module.exports = { createRateLimiterMiddleware }
