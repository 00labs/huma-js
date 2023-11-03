import { BigNumber } from 'ethers'

import {
  ChainEnum,
  isChainEnum,
  LenderApprovalProvider,
  POOL_NAME,
  POOL_TYPE,
  PoolVersion,
} from '../../utils'
import { MUMBAI_METADATA } from '../metadata/Mumbai'

export type TrancheType = 'senior' | 'junior'

export enum FirstLossCoverIndex {
  borrower = 0,
  affiliate = 1,
}

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
  poolSafe: string
  seniorTrancheVault: string
  juniorTrancheVault: string
  poolAbi: unknown
  poolSafeAbi: unknown
  poolConfigAbi: unknown
  trancheVaultAbi: unknown
  firstLossCoverAbi: unknown
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

export const CHAIN_POOLS_INFO_V2 = {
  [ChainEnum.Mumbai]: MUMBAI_METADATA,
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
