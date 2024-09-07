import { SolanaChainEnum } from '../../../utils/chain'
import { POOL_NAME, POOL_TYPE } from '../../../utils/pool'
import { SolanaChainInfo, SolanaPoolsInfo } from '../../utils'

export const SOLANA_DEVNET_INFO: SolanaChainInfo = {
  sentinel: '8GQMZVEvYsssewqu2EvoAtVeBMWEkns7vGiUMQ6V7KDo',
}

export const SOLANA_DEVNET_METADATA: SolanaPoolsInfo = {
  HumaCreditLine: {
    title: 'Test Creditline Pool',
    poolName: POOL_NAME.HumaCreditLine,
    poolType: POOL_TYPE.CreditLine,
    chainId: SolanaChainEnum.SolanaDevnet,
    industry: 'Remittance Financing',
    desc: 'This is a test pool for Huma creditline on Solana',
    pool: '69yTuBwRm8KPkXYmasxZQAzgyHs93KBaijNv5Jum71fv',
    poolId: '5o7qiQZeCbTowg75xgB5xMnYRHpXx43c6CnFbnC3MXkJ',
    poolAuthority: 'rawZV3C2THDqgwAaWJTBu4yhZzqrkqkBqV4abYA3zW3',
    poolUnderlyingTokenAccount: 'DLcZV7oAL4KQFHxMi7sptuiHAdxGpFFBGLUn2XJwAW69',
    poolConfig: '6x5UbXnyTsbXQ9sbr9PhetxYyxFzjP824vRjnjF81kht',
    humaConfig: 'eLiteCmDY2bsWbeaon4SswBW78yrUdrQZMZC4a42ssj',
    poolState: 'Cw9uXszaLmAuzQMQtwxNBrdrGMfPtjcY5hKKUAkmNusu',
    juniorTrancheMint: '7jQfrHZLDVwm9aMc23tehL4wBw7X4MtNmhmWLjrB1nHW',
    juniorTrancheState: 'DKiVJPHwDxjaSbLXHZh4m3hTs19xbvFArXYd8xEs1mee',
    seniorTrancheMint: '6nCWnzocemref4C92TV2XkTZwnHRADkbaCkT6fXUVQ8d',
    seniorTrancheState: '4CYWGuuyaCTV9Zhbba5dbK5ovnRzch7f9im2y1eao2AE',
    underlyingMint: {
      address: 'BpexACtnRKfeWLQQJY39zr8dyfDACtP4GCFDVCbVwcdF',
      symbol: 'USDC',
      decimals: 6,
      icon: 'USDC',
    },
  },
}
