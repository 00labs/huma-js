import { ChainEnum, POOL_NAME, configUtil } from 'utils'

import POOL_ABI from '../abis/Pool.json'
import poolMetadataLocalhost from '../metadata/Localhost.json'

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

export type PoolsInfoV2 = {
  [chainId: number]: {
    [poolName in POOL_NAME]?: PoolInfoV2
  }
}

const poolsInfoV2 = {
  [ChainEnum.Localhost]: poolMetadataLocalhost as unknown,
} as PoolsInfoV2

const getPoolsInfoV2 = () => {
  Object.keys(poolsInfoV2).forEach((_chainId) => {
    const chainId = Number(_chainId) as ChainEnum
    const chainPoolsInfoV2 = poolsInfoV2[chainId]
    Object.keys(chainPoolsInfoV2).forEach((_poolName) => {
      const poolName = _poolName as POOL_NAME
      const poolInfoV2 = chainPoolsInfoV2[poolName]!
      poolInfoV2.poolName = poolName
      poolInfoV2.poolAbi = POOL_ABI
    })
  })
  return poolsInfoV2
}
export const POOLS_INFO_V2 = getPoolsInfoV2()

export const getChainPoolNamesV2 = (chainId: number | undefined) => {
  if (chainId === undefined) {
    chainId = configUtil.DEFAULT_CHAIN_ID
  }
  return Object.keys(poolsInfoV2[chainId]) as POOL_NAME[]
}
