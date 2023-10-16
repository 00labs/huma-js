import {
  ChainEnum,
  LenderApprovalProvider,
  POOL_NAME,
  POOL_TYPE,
  isChainEnum,
} from '../../utils'
import { MUMBAI_METADATA } from '../metadata/Mumbai'

export type VaultType = 'senior' | 'junior'

export enum FirstLossCoverIndex {
  borrower = 0,
  affiliate = 1,
}

export type PoolInfoV2 = {
  chainId: ChainEnum
  poolName: POOL_NAME
  poolType: POOL_TYPE
  pool: string
  poolAbi: unknown
  poolSafe: string
  poolSafeAbi: unknown
  seniorTrancheVault: string
  juniorTrancheVault: string
  trancheVaultAbi: unknown
  poolUnderlyingToken: {
    address: string
    symbol: string
    decimals: number
    icon: string
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
