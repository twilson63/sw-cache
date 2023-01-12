const { WarpFactory, LoggerFactory, defaultCacheOptions } = require('warp-contracts')

const warp = WarpFactory.forMainnet()
async function main() {
  const result = await warp.contract('FMRHYgSijiUNBrFy-XqyNNXenHsCV0ThR4lGAPO4chA')
    .setEvaluationOptions({
      unsafeClient: 'allow',
      allowBigInt: true,
      internalWrites: true
    }).readState()
  console.log(result.cachedValue)

}

main()