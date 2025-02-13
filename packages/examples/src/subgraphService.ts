import { Wallet, ethers } from 'ethers'
import { SubgraphService } from '@huma-finance/sdk'
import {
  ChainEnum,
  CreditEvent,
  POOL_NAME,
  POOL_TYPE,
} from '@huma-finance/shared'
require('dotenv').config()

async function main() {
  const TEST_PRIVATE_KEY = process.env.TEST_PRIVATE_KEY
  const provider = new ethers.providers.JsonRpcProvider(
    `https://goerli.infura.io/v3/${process.env.VITE_INFURA_API_KEY}`,
    {
      name: 'Goerli',
      chainId: ChainEnum.Goerli,
    },
  )

  const wallet = new Wallet(TEST_PRIVATE_KEY, provider)

  const events = await SubgraphService.getCreditEventsForUser(
    wallet.address,
    ChainEnum.Goerli,
    POOL_NAME.HumaCreditLine,
    POOL_TYPE.CreditLine,
    [
      CreditEvent.LiquidityDeposited,
      CreditEvent.LiquidityWithdrawn,
      CreditEvent.DrawdownMade,
      CreditEvent.DrawdownMadeWithReceivable,
      CreditEvent.PaymentMade,
      CreditEvent.ReceivedPaymentProcessed,
    ],
  )
  console.log(events)
}
main()
