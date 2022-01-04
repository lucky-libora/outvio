const express = require('express')

const router = express.Router()

router.get('/default', (req, res) => {
  res.send(true)
})

router.get('/weight2', (req, res) => {
  res.send(true)
})

router.get('/weight5', (req, res) => {
  res.send(true)
})

module.exports = router
