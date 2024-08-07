import { Wallet, ethers } from 'ethers'
import { ChainEnum, POOL_NAME } from '@huma-finance/core'
import {
  getAvailableBalanceForPool,
  getAvailableCreditForPool,
  getCreditRecordForPool,
} from '@huma-finance/sdk'
require('dotenv').config()

async function main() {
  const TEST_PRIVATE_KEY = process.env.TEST_PRIVATE_KEY
  const provider = new ethers.providers.JsonRpcProvider(
    `http://127.0.0.1:8545`,
    {
      name: 'Localhost',
      chainId: ChainEnum.Localhost,
    },
  )

  const balance = await getAvailableBalanceForPool(
    POOL_NAME.HumaCreditLine,
    provider,
  )
  const availableCredit = await getAvailableCreditForPool(
    '0x71bE63f3384f5fb98995898A86B02Fb2426c5788', // Borrower account to lookup
    POOL_NAME.HumaCreditLine,
    provider,
  )
  const creditRecord = await getCreditRecordForPool(
    POOL_NAME.HumaCreditLine,
    '0x71bE63f3384f5fb98995898A86B02Fb2426c5788',
    provider,
  )

  console.log(`Pool balance: ${balance.toString()}`)
  console.log(`Available credit: ${availableCredit.toString()}`)
  console.log(`Credit Record: ${JSON.stringify(creditRecord)}`)
}
main()
