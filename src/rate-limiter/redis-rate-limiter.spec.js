const { RedisRateLimiter } = require('./redis-rate-limiter')

describe('RedisRateLimiter', () => {
  describe('#getExpireAt', () => {
    it('should return duration till next hour starts in ms', () => {
      const redisRateLimiter = new RedisRateLimiter({
        duration: 60 * 60 * 1000,
      })

      Date.now = jest.fn(() => new Date('2022-01-01T14:15:00Z').getTime())
      expect(redisRateLimiter.getExpireAt().getTime()).toBe(new Date('2022-01-01T15:00:00Z').getTime())
    })

    it('should add hour if current time is 00:00.000', () => {
      const redisRateLimiter = new RedisRateLimiter({
        duration: 60 * 60 * 1000,
      })

      Date.now = jest.fn(() => new Date('2022-01-01T14:00:00Z').getTime())
      expect(redisRateLimiter.getExpireAt().getTime()).toBe(new Date('2022-01-01T15:00:00Z').getTime())
    })
  })

  describe('#getRedisKey', () => {
    it('should join prefix key and expireAt timestamp', () => {
      const redisRateLimiter = new RedisRateLimiter({
        keyPrefix: 'prefix',
        duration: 60 * 60 * 1000,
      })

      Date.now = jest.fn(() => new Date('2022-01-01T14:00:00Z').getTime())
      expect(redisRateLimiter.getRedisKey('test')).toBe('prefix:test:1641049200000')
    })
  })

  describe('#consume', () => {
    const redisMultiMock = {
      incrby: jest.fn(() => redisMultiMock),
      pexpire: jest.fn(() => redisMultiMock),
      exec: jest.fn((cb) =>
        cb(null, [
          [null, 10],
          [null, 10000],
        ]),
      ),
    }

    const redisCliMock = {
      multi() {
        return redisMultiMock
      },
    }

    const redisRateLimiter = new RedisRateLimiter({
      keyPrefix: 'prefix',
      duration: 60 * 60 * 1000,
      storeClient: redisCliMock,
      points: 100,
    })

    beforeEach(() => {
      Date.now = jest.fn(() => new Date('2022-01-01T14:00:00Z').getTime())
    })

    it('should return limitReached: false', async () => {
      const res = await redisRateLimiter.consume('test', 10)

      expect(res).toStrictEqual({ limitReached: false })
    })

    it('should return limitReached: true with additional props if used points > weight', async () => {
      redisMultiMock.exec = jest.fn((cb) => {
        cb(null, [
          [null, 101],
          [null, 10000],
        ])
      })

      const res = await redisRateLimiter.consume('test', 10)

      expect(res).toStrictEqual({
        limitReached: true,
        consumedPoints: 101,
        resetDate: new Date('2022-01-01T15:00:00.000Z'),
      })
    })

    it('should throw an error if redis transaction throws an error', async () => {
      redisMultiMock.exec = jest.fn((cb) => {
        cb(new Error(), [])
      })

      await expect(redisRateLimiter.consume('test', 10)).rejects.toThrow()
    })
  })
})
