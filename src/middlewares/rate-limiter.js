const { createRateLimiterMiddleware } = require('../rate-limiter/middleware-factory')

const ipRateLimiterMiddleware = createRateLimiterMiddleware((req) => {
  const ip = req.headers['x-real-ip'] || req.ip

  return `ip:${ip}`
})

const userRateLimiterMiddleware = createRateLimiterMiddleware((req) => {
  return req.user ? `userId:${req.user.id}` : null
})

module.exports = { ipRateLimiterMiddleware, userRateLimiterMiddleware }
