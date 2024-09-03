import { SolanaChainEnum } from '../../../utils/chain'
import { POOL_NAME, POOL_TYPE } from '../../../utils/pool'
import { SolanaPoolsInfo } from '../../utils'

export const SOLANA_DEVNET_METADATA: SolanaPoolsInfo = {
  HumaCreditLine: {
    title: 'Test Creditline Pool',
    poolName: POOL_NAME.HumaCreditLine,
    poolType: POOL_TYPE.CreditLine,
    chainId: SolanaChainEnum.SolanaDevnet,
    industry: 'Remittance Financing',
    desc: 'This is a test pool for Huma creditline on Solana',
    pool: '9Tx5QCUZcXkqAD4SFW8ZYfwPhTTXoDzZRQAiAksXzi5E',
    poolId: 'DswJJJQnXjH7oY1itX9Gn9t9G8V1npDuRGTekBwpA2NP',
    poolConfig: 'BK24fDq8oqMzZjdWDkEghoRyVzMLbLzTEpK9XUmeJQnN',
    poolState: '4p1DpTozDtUuEfu8EsKTz6HHpyjFryTmkQFDGfuKMsft',
    juniorTrancheMint: '9kBSPD1kRoZUqnTEFEY2Nr7zpVzCnmC4M3dCTr5iwCyT',
    seniorTrancheMint: 'zg7LwnRh6YoSx1onA7XE93HWzZa16M6S92eMUeQ2oXH',
    underlyingMint: {
      pubkey: '98q2EGESBVyu1Cu5RYeejCP54tMh5SQxJFTQqNRHJ715',
      symbol: 'USDC',
      decimals: 6,
      icon: 'USDC',
    },
  },
}
