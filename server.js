const path = require('path')
const express = require('express')
const cors = require('cors')
const fpjson = require('fpjson-lang')
const { JSONPath } = require('jsonpath-plus')

const { WarpFactory, LoggerFactory, defaultCacheOptions } = require('warp-contracts')

LoggerFactory.INST.logLevel('fatal')
const warp = WarpFactory.forMainnet()
const app = express()

app.use(cors({ credentials: true }))

app.get('/contract', async (req, res) => {
  if (!req.query.id) {
    return res.status(400).send({ message: 'no contract specified' })
  }

  try {
    const result = await warp.contract(req.query.id)
      .setEvaluationOptions({
        remoteStateSyncEnabled: false,
        unsafeClient: 'skip',
        allowBigInt: true,
        internalWrites: true,
        useVM2: true
      }).readState()
    if (req.query.query) {
      const queryResult = JSONPath({ path: req.query.query, json: result.cachedValue.state });
      res.send({
        sortKey: result.sortKey,
        result: queryResult,
        validity: result.cachedValue.validity,
        status: "evaluated"
      })
      return
    }
    //console.log(result.cachedValue.errors)
    res.send({
      sortKey: result.sortKey,
      state: result.cachedValue.state,
      validity: result.cachedValue.validity,
      errorMessages: result.cachedValue.errorMessages,
      status: "evaluated"
    })
    //res.send(result.state)
  } catch (e) {
    console.log(e)
    res.status(404).send({ message: 'not found!' })
  }
})

app.get('/:contract', async (req, res) => {
  if (!req.params.contract) {
    return res.status(400).send({ message: 'no contract specified' })
  }
  try {
    const result = await warp.contract(req.params.contract)
      .setEvaluationOptions({
        unsafeClient: 'skip',
        allowBigInt: true,
        internalWrites: true,
        useVM2: true
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
        unsafeClient: 'skip',
        allowBigInt: true,
        internalWrites: true,
        useVM2: true
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
  res.send('SmartWeave Cache v1.4.15-beta.4')
})

app.listen(3000)

/*
process.on('uncaughtException', error => {
  console.log(error)

})
*/
