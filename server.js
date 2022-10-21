const path = require('path')
const express = require('express')
const cors = require('cors')

const { WarpFactory, LoggerFactory } = require('warp-contracts')

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
    //console.log(result)
    res.send(result.cachedValue.state)
    //res.send(result.state)
  } catch (e) {
    res.status(404).send({ message: 'not found!' })
  }
})

app.get('/', async (req, res) => {
  res.send('Stamp Cache v0.0.2')
})

app.listen(3000)