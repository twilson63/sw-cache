const { WarpFactory, LoggerFactory, defaultCacheOptions } = require('warp-contracts')

const STAMP = 'TlqASNDLA1Uh8yFiH-BzR_1FDag4s735F3PoUFEv2Mo'
const BAR = 'KTzTXT_ANmF84fWEKHzWURD1LWd9QaFR9yfYUwH2Lxw'
const UCM = 'pKAUV26rFgG13XwS7oZ1IQ8dDIRcdV9xnC8XEnZ7cfQ'

const HEIGHT = 1200000
const warp = WarpFactory.forMainnet()
async function main() {

  await readState(UCM)
  //  await readState(STAMP)
  //  await readState(BAR)
}

main()


async function readState(CONTRACT) {

  const result2 = await warp.contract(CONTRACT)
    .setEvaluationOptions({
      unsafeClient: 'skip',
      allowBigInt: true,
      internalWrites: true,
      useVM2: true
    }).readState()
  console.log(result2.cachedValue)

}
