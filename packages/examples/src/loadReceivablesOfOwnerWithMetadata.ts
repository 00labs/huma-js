import { Wallet, ethers } from 'ethers'
import { ReceivableService } from '@huma-shan/sdk'
import { ChainEnum, POOL_NAME, POOL_TYPE } from '@huma-shan/core'
require('dotenv').config()

async function main() {
  const TEST_PRIVATE_KEY = process.env.TEST_PRIVATE_KEY
  const provider = new ethers.providers.JsonRpcProvider(
    `https://polygon-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`,
    {
      name: 'matic',
      chainId: ChainEnum.Polygon,
    },
  )

  const wallet = new Wallet(TEST_PRIVATE_KEY, provider)

  const data = await ReceivableService.loadReceivablesOfOwnerWithMetadata(
    wallet,
    '0xea57a8a51377752ffddaa3db4d13ce8f97677f2d',
    POOL_NAME.ArfCreditPool1,
    POOL_TYPE.CreditLine,
  )

  data.map((receivable) => {
    console.log(receivable)
  })
}

main()
