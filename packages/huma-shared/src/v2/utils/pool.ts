import { BigNumber } from 'ethers'

import {
  ChainEnum,
  isChainEnum,
  LenderApprovalProvider,
  POOL_NAME,
  POOL_TYPE,
  PoolVersion,
} from '../../utils'
import { HUMA_TESTNET_METADATA } from '../metadata/humaTestnet'
import { LOCALHOST_METADATA } from '../metadata/localhost'
import { MUMBAI_METADATA } from '../metadata/mumbai'
import { FirstLossCoverIndex } from '../types'
import POOL_CREDIT_ABI from '../abis/Credit.json'
import POOL_CREDIT_LINE_ABI from '../abis/CreditLine.json'
import POOL_CREDIT_MANAGER_ABI from '../abis/CreditManager.json'
import EPOCH_MANAGER_ABI from '../abis/EpochManager.json'
import FIRST_LOSS_COVER_ABI from '../abis/FirstLossCover.json'
import POOL_ABI from '../abis/Pool.json'
import POOL_CONFIG_ABI from '../abis/PoolConfig.json'
import POOL_SAFE_ABI from '../abis/PoolSafe.json'
import TRANCHE_VAULT_ABI from '../abis/TrancheVault.json'
import CALENDAR_ABI from '../abis/Calendar.json'

export type TrancheType = 'senior' | 'junior'

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
  industry?:
    | 'Supply Chain Financing'
    | 'Remittance Financing'
    | 'Green Financing'
    | 'Invoice Factoring'
  KYC?: {
    provider: 'Securitize'
    signInRequired: KYCCopy
    verifyIdentity: KYCCopy
    emailSignatureLink: KYCCopy
    resendSignatureLink: KYCCopy
    docUnderReview: KYCCopy
  }
  supplyLink?: string
  poolUnderlyingToken?: {
    address: string
    symbol: string
    decimals: number
    icon: string
  }
  isClosed?: boolean
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
  [ChainEnum.Mumbai]: MUMBAI_METADATA,
  [ChainEnum.HumaTestnet]: HUMA_TESTNET_METADATA,
  [ChainEnum.Localhost]: LOCALHOST_METADATA,
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
