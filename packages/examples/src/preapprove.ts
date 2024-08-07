import { Wallet, ethers } from 'ethers'
import { EAService, getPoolContract } from '@huma-shan/sdk'
import { ChainEnum, POOL_NAME, POOL_TYPE } from '@huma-shan/core'
require('dotenv').config()

async function main() {
  const TEST_PRIVATE_KEY = process.env.TEST_PRIVATE_KEY
  const provider = new ethers.providers.JsonRpcProvider(
    `https://goerli.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}`,
    {
      name: 'Goerli',
      chainId: ChainEnum.Goerli,
    },
  )

  const wallet = new Wallet(TEST_PRIVATE_KEY, provider)

  const poolContract = getPoolContract(
    wallet,
    ChainEnum.Goerli,
    POOL_NAME.RequestNetwork,
    POOL_TYPE.Invoice,
  )

  const result = await EAService.preapprove(
    {
      poolAddress: poolContract.address,
      borrowerWalletAddress: wallet.address,
      context: {
        payerWalletAddress: poolContract.address,
      },
    },
    ChainEnum.Goerli, // chainId
  )
  console.log(result)
}
main()
