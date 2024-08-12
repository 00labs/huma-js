import { BigNumber } from 'ethers'

import {
  ChainEnum,
  isChainEnum,
  LenderApprovalProvider,
  POOL_NAME,
  POOL_TYPE,
  PoolVersion,
  REDIRECTS,
} from '../../utils'
import CALENDAR_ABI from '../abis/Calendar.json'
import POOL_CREDIT_ABI from '../abis/Credit.json'
import POOL_CREDIT_LINE_ABI from '../abis/CreditLine.json'
import POOL_CREDIT_MANAGER_ABI from '../abis/CreditManager.json'
import EPOCH_MANAGER_ABI from '../abis/EpochManager.json'
import FIRST_LOSS_COVER_ABI from '../abis/FirstLossCover.json'
import POOL_ABI from '../abis/Pool.json'
import POOL_CONFIG_ABI from '../abis/PoolConfig.json'
import POOL_SAFE_ABI from '../abis/PoolSafe.json'
import TRANCHE_VAULT_ABI from '../abis/TrancheVault.json'
import { ALFAJORES_METADATA } from '../metadata/alfajores'
import { AMOY_METADATA } from '../metadata/amoy'
import { BASE_SEPOLIA_METADATA } from '../metadata/baseSepolia'
import { CELO_METADATA } from '../metadata/celo'
import { LOCALHOST_METADATA } from '../metadata/localhost'
import { SCROLL_METADATA } from '../metadata/scroll'
import { SCROLL_SEPOLIA_METADATA } from '../metadata/scrollSepolia'
import { FirstLossCoverIndex } from '../types'

export type TrancheType = 'senior' | 'junior'

export type IndustryType =
  | 'Supply Chain Financing'
  | 'Remittance Financing'
  | 'Green Financing'
  | 'Invoice Factoring'
  | 'None'

export type KYCCopy = {
  title: string
  description: string
  buttonText?: string
}

export type PoolAbis = {
  poolAbi: unknown
  poolCreditAbi: unknown
  poolCreditLineAbi: unknown
  poolCreditManagerAbi: unknown
  poolSafeAbi: unknown
  poolConfigAbi: unknown
  trancheVaultAbi: unknown
  firstLossCoverAbi: unknown
  epochManagerAbi: unknown
  calendarAbi: unknown
}

export type PoolInfoV2 = {
  chainId: ChainEnum
  poolVersion: PoolVersion
  poolName: POOL_NAME
  poolType: POOL_TYPE
  pool: string
  poolConfig: string
  poolCredit: string
  poolCreditManager: string
  poolSafe: string
  seniorTrancheVault: string
  juniorTrancheVault: string
  epochManager: string
  firstLossCovers: {
    [FirstLossCoverIndex.borrower]: string
    [FirstLossCoverIndex.admin]: string
  }
  seniorAPY: string
  juniorAPY: string
  title: string
  desc: string
  lenderApprovalProvider?: LenderApprovalProvider
  industry: IndustryType
  KYC?: {
    Securitize?: {
      signInRequired: KYCCopy
      verifyIdentity: KYCCopy
      emailSignatureLink: KYCCopy
      resendSignatureLink: KYCCopy
      docUnderReview: KYCCopy
    }
    Persona?: {
      signInRequired: KYCCopy
      verifyIdentity: KYCCopy
      verificationDeclined: KYCCopy
      verificationNeedsReview: KYCCopy
    }
  }
  supplyLink?: string
  poolUnderlyingToken: {
    address: string
    symbol: string
    decimals: number
    icon: string
  }
  receivable?: string
  isClosed?: boolean
  extra?: {
    hidden?: boolean
    borrower?: string // For single borrower pools
    rwrUploader?: string // For single borrower pools where receivables are uploaded by a different wallet
    enableGetTestUSDC?: boolean
  }
  redirect?: REDIRECTS
}

export type PoolsInfoV2 = {
  [poolName in POOL_NAME]?: PoolInfoV2
}

export type ChainPoolsInfoV2 = {
  [chainId in ChainEnum]: PoolsInfoV2
}

export const POOL_ABI_V2: PoolAbis = {
  poolAbi: POOL_ABI,
  poolCreditAbi: POOL_CREDIT_ABI,
  poolCreditLineAbi: POOL_CREDIT_LINE_ABI,
  poolCreditManagerAbi: POOL_CREDIT_MANAGER_ABI,
  poolSafeAbi: POOL_SAFE_ABI,
  poolConfigAbi: POOL_CONFIG_ABI,
  trancheVaultAbi: TRANCHE_VAULT_ABI,
  firstLossCoverAbi: FIRST_LOSS_COVER_ABI,
  epochManagerAbi: EPOCH_MANAGER_ABI,
  calendarAbi: CALENDAR_ABI,
}

export const CHAIN_POOLS_INFO_V2 = {
  [ChainEnum.Alfajores]: ALFAJORES_METADATA,
  [ChainEnum.Celo]: CELO_METADATA,
  [ChainEnum.Amoy]: AMOY_METADATA,
  [ChainEnum.BaseSepolia]: BASE_SEPOLIA_METADATA,
  [ChainEnum.Localhost]: LOCALHOST_METADATA,
  [ChainEnum.Scroll]: SCROLL_METADATA,
  [ChainEnum.ScrollSepolia]: SCROLL_SEPOLIA_METADATA,
} as ChainPoolsInfoV2

export const getChainPoolNamesV2 = (
  chainId: number | undefined,
): POOL_NAME[] | undefined => {
  if (!chainId) {
    return undefined
  }

  if (!isChainEnum(chainId) || !CHAIN_POOLS_INFO_V2[chainId]) {
    return []
  }

  return Object.keys(CHAIN_POOLS_INFO_V2[chainId]) as POOL_NAME[]
}

export const isV2Pool = (chainId: number, pool: string): boolean => {
  const chainPoolsInfo = CHAIN_POOLS_INFO_V2[chainId as ChainEnum]
  if (!chainPoolsInfo) {
    return false
  }
  return Object.values(chainPoolsInfo).some(
    (poolInfo) => poolInfo.pool.toLowerCase() === pool.toLowerCase(),
  )
}

export function getPoolInfoForPoolAddressV2(
  chainId: ChainEnum,
  poolAddress: string,
): PoolInfoV2 | null {
  const poolsInfo = CHAIN_POOLS_INFO_V2[chainId]
  if (!poolsInfo) {
    return null
  }

  let foundPoolInfo = null

  for (const poolInfo of Object.values(poolsInfo)) {
    if (poolInfo.pool.toLowerCase() === poolAddress.toLowerCase()) {
      foundPoolInfo = poolInfo
      break
    }
  }

  return foundPoolInfo
}

export type UnderlyingTokenInfo = {
  address: string
  symbol: string
  decimals: number
}

export type PoolSafeStatsV2 = {
  allowance: BigNumber
}

export type FirstLossCoverInfoV2 = {
  totalAssets: BigNumber
}

export type TrancheVaultInfoV2 = {
  totalAssets: BigNumber
}

export type TrancheVaultStatsV2 = {
  lenderApproved: boolean
  lenderPosition: BigNumber
}

export type UnderlyingTokenStatsV2 = {
  balance: BigNumber
}
