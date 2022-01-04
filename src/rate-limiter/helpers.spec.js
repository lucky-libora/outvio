jest.mock('./config', () => {
  const endpointsConfig = [
    {
      pattern: '/weight',
      weight: 50,
    },
    {
      pattern: '/weight2',
      weight: 2,
    },
    {
      pattern: '/weight5',
      weight: 5,
    },
  ]

  return { endpointsConfig }
})

const { mapEndpointsConfig, getEndpointWeight } = require('./helpers')

describe('Middleware Factory', () => {
  describe('mapEndpointsConfig', () => {
    it('should sort endpoints desc by pattern length', () => {
      const endpointConfig = [
        {
          pattern: 'short',
          weight: 1,
        },
        {
          pattern: 'average',
          weight: 2,
        },
        {
          pattern: 'very_long_pattern',
          weight: 5,
        },
      ]

      const res = mapEndpointsConfig(endpointConfig)
      expect(res).toHaveLength(3)
      expect(res[0].weight).toBe(5)
      expect(res[1].weight).toBe(2)
      expect(res[2].weight).toBe(1)
    })
  })

  describe('getEndpointWeight', () => {
    it('should return 2', () => {
      expect(getEndpointWeight('/weight2')).toBe(2)
    })

    it('should return 5', () => {
      expect(getEndpointWeight('/weight5')).toBe(5)
    })

    it('should return 50', () => {
      expect(getEndpointWeight('/weight')).toBe(50)
    })

    it('should return default value for unmatched endpoint', () => {
      expect(getEndpointWeight('/test')).toBe(1)
    })
  })
})
