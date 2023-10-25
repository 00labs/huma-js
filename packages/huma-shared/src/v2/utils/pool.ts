import {
  ChainEnum,
  LenderApprovalProvider,
  POOL_NAME,
  isChainEnum,
} from '../../utils'
import { LOCALHOST_METADATA } from '../metadata/Localhost'
import { MUMBAI_METADATA } from '../metadata/Mumbai'

export type VaultType = 'senior' | 'junior'

export enum FirstLossCoverIndex {
  borrower = 0,
  affiliate = 1,
}

export type PoolInfoV2 = {
  chainId: ChainEnum
  poolName: POOL_NAME
  pool: string
  poolAbi: unknown
  poolVault: string
  poolVaultAbi: unknown
  seniorTrancheVault: string
  juniorTrancheVault: string
  trancheVaultAbi: unknown
  seniorAPY: string
  juniorAPY: string
  title: string
  borrowDesc: string
  lendDesc: string
  lenderApprovalProvider?: LenderApprovalProvider
}

export type PoolsInfoV2 = {
  [poolName in POOL_NAME]?: PoolInfoV2
}

export type ChainPoolsInfoV2 = {
  [chainId in ChainEnum]: PoolsInfoV2
}

export const CHAIN_POOLS_INFO_V2 = {
  [ChainEnum.Localhost]: LOCALHOST_METADATA,
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
