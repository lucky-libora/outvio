const { endpointsConfig } = require('./config')

function mapEndpointsConfig(config) {
  return config
    .sort((endpoint1, endpoint2) => {
      return endpoint2.pattern.length - endpoint1.pattern.length
    })
    .map(({ pattern, weight }) => {
      return {
        regex: new RegExp(pattern),
        weight,
      }
    })
}

const endpointWeights = mapEndpointsConfig(endpointsConfig)

function getEndpointWeight(url) {
  const match = endpointWeights.find(({ regex }) => url.match(regex))
  if (!match) {
    return 1
  }

  return match.weight
}

module.exports = { mapEndpointsConfig, getEndpointWeight }
