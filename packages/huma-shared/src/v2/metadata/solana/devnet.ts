import { ChainEnum, POOL_NAME, POOL_TYPE } from 'utils'
import { SolanaPoolsInfo } from 'v2/utils'

export const SOLANA_DEVNET_METADATA: SolanaPoolsInfo = {
  HumaCreditLine: {
    title: 'Test Creditline Pool',
    poolName: POOL_NAME.HumaCreditLine,
    poolType: POOL_TYPE.CreditLine,
    chainId: ChainEnum.SolanaDevnet,
    pool: '9Tx5QCUZcXkqAD4SFW8ZYfwPhTTXoDzZRQAiAksXzi5E',
    poolUnderlyingToken: {
      address: '4XCyPrwwYmi52PWXJfFeDpy8JZbEguH9XZXBDREWAKXL',
      symbol: 'USDC',
      decimals: 6,
      icon: 'USDC',
    },
  },
}
