import { Wallet, ethers } from 'ethers'
import { ChainEnum, POOL_NAME } from '@huma-finance/shared'
import {
  getAvailableBalanceForPool,
  getAvailableCreditForPool,
} from '@huma-finance/sdk'
require('dotenv').config()

async function main() {
  const TEST_PRIVATE_KEY = process.env.TEST_PRIVATE_KEY
  const provider = new ethers.providers.JsonRpcProvider(
    `https://polygon-mumbai.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`,
    {
      name: 'Mumbai',
      chainId: ChainEnum.Mumbai,
    },
  )
  const wallet = new Wallet(TEST_PRIVATE_KEY, provider)

  const balance = await getAvailableBalanceForPool(POOL_NAME.JiaV2, provider)
  const availableCredit = await getAvailableCreditForPool(
    '0x89cC431c50953bdF3a632B804782d610094A4937', // Borrower account to lookup
    POOL_NAME.JiaV2,
    provider,
  )

  console.log(`Pool balance: ${balance.toString()}`)
  console.log(`Available credit: ${availableCredit.toString()}`)
}
main()
