import { Wallet, ethers } from 'ethers'
import { ReceivableService } from '@huma-finance/sdk'
import { ChainEnum, POOL_NAME, POOL_TYPE } from '@huma-finance/shared'
require('dotenv').config()

async function main() {
  const TEST_PRIVATE_KEY = process.env.TEST_PRIVATE_KEY
  const provider = new ethers.providers.JsonRpcProvider(
    `https://polygon-mainnet.g.alchemy.com/v2/${process.env.VITE_ALCHEMY_API_KEY}`,
    {
      name: 'matic',
      chainId: ChainEnum.Polygon,
    },
  )

  const wallet = new Wallet(TEST_PRIVATE_KEY, provider)

  const data = await ReceivableService.loadReceivablesOfOwnerWithMetadata(
    ChainEnum.Polygon,
    '0xea57a8a51377752ffddaa3db4d13ce8f97677f2d',
    POOL_NAME.ArfCreditPool1,
    POOL_TYPE.CreditLine,
    'v1', // version
  )

  data.map((receivable) => {
    console.log(receivable)
  })
}

main()
