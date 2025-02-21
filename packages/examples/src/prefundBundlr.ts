import { Wallet, ethers } from 'ethers'
import { ARWeaveService, getBundlrNetworkConfig } from '@huma-finance/sdk'
import { ChainEnum } from '@huma-finance/shared'
require('dotenv').config()

async function main() {
  const TEST_PRIVATE_KEY = process.env.TEST_PRIVATE_KEY
  const provider = new ethers.providers.JsonRpcProvider(
    `https://polygon-mumbai.g.alchemy.com/v2/${process.env.VITE_ALCHEMY_API_KEY}`,
    {
      name: 'Mumbai',
      chainId: ChainEnum.Mumbai,
    },
  )
  //   const provider = new ethers.providers.JsonRpcProvider(
  //     `https://goerli.infura.io/v3/${process.env.VITE_INFURA_API_KEY}`,
  //     {
  //       name: "Goerli",
  //       chainId: ChainEnum.Goerli,
  //     }
  //   );

  const wallet = new Wallet(TEST_PRIVATE_KEY, provider)

  const bundlrInstance = await ARWeaveService.getBundlrInstance(
    getBundlrNetworkConfig(ChainEnum.Mumbai),
    TEST_PRIVATE_KEY,
  )

  const balBefore = await bundlrInstance.getBalance(wallet.address)
  console.log(`Balance before: ${balBefore}`)

  const fundResponse = await ARWeaveService.prefundBundlr(
    getBundlrNetworkConfig(ChainEnum.Mumbai),
    TEST_PRIVATE_KEY,
    0.01, // Fund with 0.01 matic
  )
  console.log(fundResponse)

  const balAfter = await bundlrInstance.getBalance(wallet.address)
  console.log(`Balance after: ${balAfter}`)
}
main()
