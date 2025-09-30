import { POOL_NAME, POOL_TYPE } from '../utils'
import { IndustryType, KYCType } from '../v2'
import { SolanaChainEnum } from './chain'
import {
  SOLANA_DEVNET_INFO,
  SOLANA_DEVNET_METADATA,
  SOLANA_DEVNET_PERMISSIONLESS,
} from './metadata/devnet'
import {
  SOLANA_MAINNET_INFO,
  SOLANA_MAINNET_METADATA,
  SOLANA_MAINNET_PERMISSIONLESS,
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
    hasEscrowPayments?: boolean
  }
  escrow?: {
    accountId: string
    asset: {
      address: string
      symbol: string
      decimals: number
    }[]
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

export type SolanaChainInfoPermissionless = {
  poolProgram: string
  humaConfig: string
  poolConfig: string
  poolState: string
  classicModeConfig: string
  classicModeMint: string
  maxiModeConfig: string
  maxiModeMint: string
  underlyingMint: string
}

export type SolanaChainsInfo = {
  [chainId in SolanaChainEnum]: SolanaChainInfo
}

export const SOLANA_CHAIN_INFO = {
  [SolanaChainEnum.SolanaDevnet]: SOLANA_DEVNET_INFO,
  [SolanaChainEnum.SolanaMainnet]: SOLANA_MAINNET_INFO,
} as SolanaChainsInfo

export type SolanaChainsInfoPermissionless = {
  [chainId in SolanaChainEnum]: SolanaChainInfoPermissionless
}

export const SOLANA_CHAIN_INFO_PERMISSIONLESS = {
  [SolanaChainEnum.SolanaDevnet]: SOLANA_DEVNET_PERMISSIONLESS,
  [SolanaChainEnum.SolanaMainnet]: SOLANA_MAINNET_PERMISSIONLESS,
} as SolanaChainsInfoPermissionless
