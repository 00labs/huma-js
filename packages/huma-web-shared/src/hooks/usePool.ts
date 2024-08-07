import {
  POOL_NAME,
  POOL_TYPE,
  PoolContractMap,
  PoolInfoType,
} from '../utils/pool'

export const usePoolInfo = (
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  chainId: number | undefined,
): PoolInfoType | undefined => {
  const poolInfo = chainId
    ? PoolContractMap[chainId]?.[poolType]?.[poolName]
    : undefined
  return poolInfo
}
