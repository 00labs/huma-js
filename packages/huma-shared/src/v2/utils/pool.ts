import { ChainEnum, POOL_NAME, isChainEnum, isPoolName } from '../../utils'
import POOL_ABI from '../abis/Pool.json'
import { LOCALHOST_METADATA } from '../metadata/Localhost'
import { MUMBAI_METADATA } from '../metadata/Mumbai'

export type PoolInfoV2 = {
  poolName: POOL_NAME
  pool: string
  poolAbi: unknown
  underlyingToken: {
    address: string
    symbol: string
    decimals: number
    icon: string
  }
  estAPY: string
  title: string
  borrowDesc: string
  lendDesc: string
}

export type PoolsMetadataV2 = {
  [poolName in POOL_NAME]?: Omit<PoolInfoV2, 'poolName' | 'poolAbi'>
}

export type PoolsInfoV2 = {
  [chainId in ChainEnum]: {
    [poolName in POOL_NAME]?: PoolInfoV2
  }
}

const poolsInfoV2 = {
  [ChainEnum.Localhost]: LOCALHOST_METADATA,
  [ChainEnum.Mumbai]: MUMBAI_METADATA,
} as PoolsInfoV2

const getPoolsInfoV2 = (): PoolsInfoV2 => {
  Object.values(poolsInfoV2).forEach((chainPoolsInfoV2) => {
    Object.keys(chainPoolsInfoV2).forEach((poolName) => {
      if (isPoolName(poolName)) {
        const poolInfoV2 = chainPoolsInfoV2[poolName]!
        poolInfoV2.poolName = poolName
        poolInfoV2.poolAbi = POOL_ABI
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

  const poolNames: POOL_NAME[] = []
  Object.keys(poolsInfoV2[chainId]).forEach((poolName) => {
    if (isPoolName(poolName)) {
      poolNames.push(poolName)
    }
  })

  return poolNames
}
