import { ChainEnum, POOL_NAME, isChainEnum, isPoolName } from '../../utils'
import POOL_ABI from '../abis/Pool.json'
import TRANCHE_VAULT_ABI from '../abis/TrancheVault.json'
import { LOCALHOST_METADATA } from '../metadata/Localhost'
import { MUMBAI_METADATA } from '../metadata/Mumbai'

export type VaultType = 'senior' | 'junior'

export type PoolInfoV2 = {
  poolName: POOL_NAME
  pool: string
  poolAbi: unknown
  seniorTrancheVault: string
  juniorTrancheVault: string
  trancheVaultAbi: unknown
  underlyingToken: {
    address: string
    symbol: string
    decimals: number
    icon: string
  }
  seniorAPY: string
  juniorAPY: string
  title: string
  borrowDesc: string
  lendDesc: string
}

export type PoolsInfoV2 = {
  [poolName in POOL_NAME]?: PoolInfoV2
}

export type ChainPoolsInfoV2 = {
  [chainId in ChainEnum]: PoolsInfoV2
}

const poolsInfoV2 = {
  [ChainEnum.Localhost]: LOCALHOST_METADATA,
  [ChainEnum.Mumbai]: MUMBAI_METADATA,
} as ChainPoolsInfoV2

const getPoolsInfoV2 = (): ChainPoolsInfoV2 => {
  Object.values(poolsInfoV2).forEach((chainPoolsInfoV2) => {
    Object.keys(chainPoolsInfoV2).forEach((poolName) => {
      if (isPoolName(poolName)) {
        const poolInfoV2 = chainPoolsInfoV2[poolName]!
        poolInfoV2.poolName = poolName
        poolInfoV2.poolAbi = POOL_ABI
        poolInfoV2.trancheVaultAbi = TRANCHE_VAULT_ABI
      }
    })
  })
  return poolsInfoV2
}
export const POOLS_INFO_V2 = getPoolsInfoV2()

export const getChainPoolNamesV2 = (
  chainId: number | undefined,
): POOL_NAME[] | undefined => {
  if (!chainId) {
    return undefined
  }

  if (!isChainEnum(chainId) || !poolsInfoV2[chainId]) {
    return []
  }

  return Object.keys(poolsInfoV2[chainId]) as POOL_NAME[]
}
