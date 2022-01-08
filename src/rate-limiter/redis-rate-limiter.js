class RedisRateLimiter {
  constructor({ storeClient, keyPrefix, points, duration }) {
    this.storeClient = storeClient
    this.keyPrefix = keyPrefix
    this.points = points
    this.duration = duration
  }

  consume(key, weight = 1) {
    const redisKey = this.getRedisKey(key)
    const resetDate = this.getExpireAt()
    const expiration = resetDate - new Date()

    return new Promise((s, e) => {
      this.storeClient
        .multi()
        .incrby(redisKey, weight)
        .pexpire(redisKey, expiration)
        .exec((err, [incrByResult]) => {
          if (err) {
            return e(err)
          }

          const [, consumedPoints] = incrByResult
          if (parseInt(consumedPoints) > this.points) {
            return s({
              limitReached: true,
              consumedPoints,
              resetDate,
            })
          }

          s({ limitReached: false })
        })
    })
  }

  getExpireAt() {
    const now = Date.now()
    if (now % this.duration === 0) {
      return new Date(now + this.duration)
    }

    return new Date(Math.ceil(now / this.duration) * this.duration)
  }

  getRedisKey(key) {
    return `${this.keyPrefix}:${key}:${this.getExpireAt().getTime()}`
  }
}

module.exports = { RedisRateLimiter }
