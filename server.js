import express from 'express'
import cors from 'cors'
import { WarpFactory } from './warp/lib/cjs/index.js'

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
        allowBigInt: true
      }).readState()
    res.send(result.cachedValue.state)
  } catch (e) {
    res.status(404).send({ message: 'not found!' })
  }
})

app.get('/', async (req, res) => {
  const result = await warp.contract('9nDWI3eHrMQbrfs9j8_YPfLbYJmBodgn7cBCG8bii4o')
    .setEvaluationOptions({
      allowUnsafeClient: true,
      allowBigInt: true
    }).readState()
  res.send(result.cachedValue.state)
})

app.listen(3000)