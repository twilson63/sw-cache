const express = require('express')
const cors = require('cors')
const Arweave = require('arweave')
const { WarpNodeFactory, LoggerFactory } = require('warp1')
const { WarpFactory } = require('warp-contracts')

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
})
LoggerFactory.INST.logLevel('fatal')
const warp = WarpNodeFactory.memCached(arweave)
const warp2 = WarpFactory.forMainnet()
const app = express()

warp.contract('aSMILD7cEJr93i7TAVzzMjtci_sGkXcWnqpDkG6UGcA')
  .setEvaluationOptions({
    allowUnsafeClient: true,
    allowBigInt: true,
    internalWrites: true
  }).readState()
  .then(_ => console.log('preloading stamps contract...'))

app.use(cors({ credentials: true }))

// app.get('/aSMILD7cEJr93i7TAVzzMjtci_sGkXcWnqpDkG6UGcA', async (req, res) => {
//   try {
//     const result = await warp2.contract('aSMILD7cEJr93i7TAVzzMjtci_sGkXcWnqpDkG6UGcA')
//       .setEvaluationOptions({
//         allowUnsafeClient: true,
//         allowBigInt: true,
//         internalWrites: true
//       }).readState()
//     //console.log(result)
//     res.send(result.cachedValue.state)
//     //res.send(result.cache)
//   } catch (e) {
//     res.status(404).send({ message: 'not found!' })
//   }
// })

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
    //res.send(result.cachedValue.state)
    res.send(result.state)
  } catch (e) {
    res.status(404).send({ message: 'not found!' })
  }
})

app.get('/', async (req, res) => {
  res.send('Stamp Cache v0.0.2')
})

app.listen(3000)