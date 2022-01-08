const { redisClient } = require('../redis')
const { getEndpointWeight } = require('./helpers')
const { RedisRateLimiter } = require('./redis-rate-limiter')

const limit = parseInt(process.env.RATE_LIMITER_LIMIT)
const duration = parseInt(process.env.RATE_LIMITER_DURATION_IN_MILLISECONDS)

const rateLimiter = new RedisRateLimiter({
  storeClient: redisClient,
  keyPrefix: 'rate_limiter:',
  points: limit,
  duration,
})

function createRateLimiterMiddleware(keyGetter) {
  return async (req, res, next) => {
    const key = keyGetter(req)
    if (!key) {
      return next()
    }

    const weight = getEndpointWeight(req.url)
    const rateLimiterResult = await rateLimiter.consume(key, weight)
    if (rateLimiterResult.limitReached) {
      return res.status(429).send({
        message: 'Too Many Requests',
        currentUsage: rateLimiterResult.currentUsage,
        usageLimit: limit,
        resetDate: rateLimiterResult.resetDate,
      })
    }

    return next()
  }
}

module.exports = { createRateLimiterMiddleware }
