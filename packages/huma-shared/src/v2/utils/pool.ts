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
import POOL_CREDIT_MANAGER_ABI from '../abis/CreditManager.json'
import EPOCH_MANAGER_ABI from '../abis/EpochManager.json'
import FIRST_LOSS_COVER_ABI from '../abis/FirstLossCover.json'
import POOL_ABI from '../abis/Pool.json'
import POOL_CONFIG_ABI from '../abis/PoolConfig.json'
import POOL_SAFE_ABI from '../abis/PoolSafe.json'
import TRANCHE_VAULT_ABI from '../abis/TrancheVault.json'

export type TrancheType = 'senior' | 'junior'

export type KYCCopy = {
  title: string
  description: string
  buttonText?: string
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
    [FirstLossCoverIndex.affiliate]: string
  }
  poolAbi?: unknown
  poolCreditAbi?: unknown
  poolCreditManagerAbi?: unknown
  poolSafeAbi?: unknown
  poolConfigAbi?: unknown
  trancheVaultAbi?: unknown
  firstLossCoverAbi?: unknown
  epochManagerAbi?: unknown
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
}

export type PoolsInfoV2 = {
  [poolName in POOL_NAME]?: PoolInfoV2
}

export type ChainPoolsInfoV2 = {
  [chainId in ChainEnum]: PoolsInfoV2
}

const getMetadataWithAbis = (metadata: PoolsInfoV2) => {
  Object.keys(metadata).forEach((poolName) => {
    const pool = metadata[poolName as POOL_NAME]
    if (pool) {
      pool.poolAbi = POOL_ABI
      pool.poolCreditAbi = POOL_CREDIT_ABI
      pool.poolCreditManagerAbi = POOL_CREDIT_MANAGER_ABI
      pool.poolSafeAbi = POOL_SAFE_ABI
      pool.poolConfigAbi = POOL_CONFIG_ABI
      pool.trancheVaultAbi = TRANCHE_VAULT_ABI
      pool.firstLossCoverAbi = FIRST_LOSS_COVER_ABI
      pool.epochManagerAbi = EPOCH_MANAGER_ABI
    }
  })
  return metadata
}

export const CHAIN_POOLS_INFO_V2 = {
  [ChainEnum.Mumbai]: getMetadataWithAbis(MUMBAI_METADATA),
  [ChainEnum.HumaTestnet]: getMetadataWithAbis(HUMA_TESTNET_METADATA),
  [ChainEnum.Localhost]: getMetadataWithAbis(LOCALHOST_METADATA),
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
