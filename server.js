import express from 'express'
import cors from 'cors'
import WarpSDK from 'warp-contracts'
//const WarpSDK = await import('warp-contracts/cjs')
const warp = WarpSDK.WarpFactory.forMainnet()

const app = express()

app.use(cors({ credentials: true }))

app.get('/', async (req, res) => {
  const result = await warp.contract('9nDWI3eHrMQbrfs9j8_YPfLbYJmBodgn7cBCG8bii4o')
    .setEvaluationOptions({
      allowUnsafeClient: true,
      allowBigInt: true
    }).readState()
  res.send(result.cachedValue.state)
})

app.listen(3000)