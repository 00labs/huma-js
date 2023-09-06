import { useWeb3React } from '@web3-react/core'

import {
  POOL_NAME,
  POOL_TYPE,
  PoolContractMap,
  PoolInfoType,
} from '../utils/pool'

export const usePoolInfo = (
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
): PoolInfoType | undefined => {
  const { chainId } = useWeb3React()
  const poolInfo = chainId
    ? PoolContractMap[chainId]?.[poolType]?.[poolName]
    : undefined
  return poolInfo
}
