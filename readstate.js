const { WarpFactory, LoggerFactory, defaultCacheOptions } = require('warp-contracts')

const STAMP = 'FMRHYgSijiUNBrFy-XqyNNXenHsCV0ThR4lGAPO4chA'
const BAR = 'VFr3Bk-uM-motpNNkkFg4lNW1BMmSfzqsVO551Ho4hA'

const warp = WarpFactory.forMainnet()
async function main() {
  const result = await warp.contract(STAMP)
    .setEvaluationOptions({
      allowUnsafeClient: true,
      allowBigInt: true,
      internalWrites: true,
      useVM2: true
    }).readState()
  //console.log(result.cachedValue)

  console.log(result.cachedValue.state.balances['vh-NTHVvlKZqRxc8LyyTNok65yQ55a_PJ1zWLb9G2JI'] / 1e12)
  console.log(result.cachedValue.state.balances['h7wP8NjoGkJTdLXC6kwS6fLTNgfeYbZr9YoED5NFQX0'] / 1e12)
  
  const result2 = await warp.contract(BAR)
    .setEvaluationOptions({
      allowUnsafeClient: true,
      allowBigInt: true,
      internalWrites: true,
      useVM2: true
    }).readState()

  console.log(result2.cachedValue.state.balances['vh-NTHVvlKZqRxc8LyyTNok65yQ55a_PJ1zWLb9G2JI'] / 1e6)
  console.log(result2.cachedValue.state.balances['h7wP8NjoGkJTdLXC6kwS6fLTNgfeYbZr9YoED5NFQX0'] / 1e6)
}

main()