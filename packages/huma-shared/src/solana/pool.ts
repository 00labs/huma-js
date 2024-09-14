import { POOL_NAME, POOL_TYPE } from '../utils'
import { IndustryType } from '../v2'
import { SolanaChainEnum } from './chain'
import { SOLANA_DEVNET_INFO, SOLANA_DEVNET_METADATA } from './metadata/devnet'

export type SolanaPoolInfo = {
  title: string
  chainId: SolanaChainEnum
  poolName: POOL_NAME
  poolType: POOL_TYPE
  industry: IndustryType
  desc: string
  poolId: string
  poolAuthority: string
  poolUnderlyingTokenAccount: string
  poolConfig: string
  poolState: string
  juniorTrancheMint: string
  juniorTrancheState: string
  seniorTrancheMint: string
  seniorTrancheState: string
  humaConfig: string
  underlyingMint: {
    address: string
    symbol: string
    decimals: number
    icon: string
  }
  isClosed?: boolean
}

export type SolanaPoolsInfo = {
  [poolName in POOL_NAME]?: SolanaPoolInfo
}

export type SolanaChainPoolsInfo = {
  [chainId in SolanaChainEnum]: SolanaPoolsInfo
}

export const SOLANA_CHAIN_POOLS_INFO = {
  [SolanaChainEnum.SolanaDevnet]: SOLANA_DEVNET_METADATA,
} as SolanaChainPoolsInfo

export type SolanaChainInfo = {
  poolProgram: string
  humaProgramAuthority: string
  sentinel: string
}

export type SolanaChainsInfo = {
  [chainId in SolanaChainEnum]: SolanaChainInfo
}

export const SOLANA_CHAIN_INFO = {
  [SolanaChainEnum.SolanaDevnet]: SOLANA_DEVNET_INFO,
} as SolanaChainsInfo
