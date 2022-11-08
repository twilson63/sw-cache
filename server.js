const path = require('path')
const express = require('express')
const cors = require('cors')
const fpjson = require('fpjson-lang')

const { WarpFactory, LoggerFactory, defaultCacheOptions } = require('warp-contracts')

LoggerFactory.INST.logLevel('fatal')
const warp = WarpFactory.forMainnet()
const app = express()

app.use(cors({ credentials: true }))

app.get('/:contract', async (req, res) => {
  if (!req.params.contract) {
    return res.status(400).send({ message: 'no contract specified' })
  }
  try {
    const result = await warp.contract(req.params.contract)
      .setEvaluationOptions({
        allowUnsafeClient: true,
        allowBigInt: true,
        internalWrites: true
      }).readState()
    //console.log(result.cachedValue.errors)
    res.send(result.cachedValue.state)
    //res.send(result.state)
  } catch (e) {
    console.log(e)
    res.status(404).send({ message: 'not found!' })
  }
})

app.post('/:contract', express.json(), async (req, res) => {
  if (!req.params.contract) {
    return res.status(400).send({ message: 'no contract specified' })
  }
  try {
    const result = await warp.contract(req.params.contract)
      .setEvaluationOptions({
        allowUnsafeClient: true,
        allowBigInt: true,
        internalWrites: true
      }).readState()
    //console.log(result.cachedValue.errors)
    const fpresult = fpjson.default([req.body, result.cachedValue.state])
    res.send({ result: fpresult })
    //res.send(result.state)
  } catch (e) {
    console.log(e.message)
    res.status(404).send({ message: 'not found!' })
  }
})

app.get('/', async (req, res) => {
  res.send('Stamp Cache v0.0.3')
})

app.listen(3000)