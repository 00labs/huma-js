import { POOL_NAME, POOL_TYPE } from '../utils'
import { IndustryType, KYCType } from '../v2'
import { SolanaChainEnum } from './chain'
import { SOLANA_DEVNET_INFO, SOLANA_DEVNET_METADATA } from './metadata/devnet'
import {
  SOLANA_MAINNET_INFO,
  SOLANA_MAINNET_METADATA,
} from './metadata/mainnet'

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
  trancheDecimals: number
  humaConfig: string
  underlyingMint: {
    address: string
    symbol: string
    decimals: number
    icon: string
  }
  KYC?: KYCType
  extra?: {
    isClosed?: boolean
    hidden?: boolean
    hasReceivables?: boolean
    investorReportLink?: string
  }
}

export type SolanaPoolsInfo = {
  [poolName in POOL_NAME]?: SolanaPoolInfo
}

export type SolanaChainPoolsInfo = {
  [chainId in SolanaChainEnum]: SolanaPoolsInfo
}

export const SOLANA_CHAIN_POOLS_INFO = {
  [SolanaChainEnum.SolanaDevnet]: SOLANA_DEVNET_METADATA,
  [SolanaChainEnum.SolanaMainnet]: SOLANA_MAINNET_METADATA,
} as SolanaChainPoolsInfo

export type SolanaChainInfo = {
  poolProgram: string
  sentinel: string
}

export type SolanaChainsInfo = {
  [chainId in SolanaChainEnum]: SolanaChainInfo
}

export const SOLANA_CHAIN_INFO = {
  [SolanaChainEnum.SolanaDevnet]: SOLANA_DEVNET_INFO,
  [SolanaChainEnum.SolanaMainnet]: SOLANA_MAINNET_INFO,
} as SolanaChainsInfo
