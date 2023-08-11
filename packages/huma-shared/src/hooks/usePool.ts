import { useWeb3React } from '@web3-react/core'
import { useEffect } from 'react'
import { useHistory } from 'react-router'

import {
  POOL_NAME,
  POOL_TYPE,
  PoolContractMap,
  PoolInfoType,
} from '../utils/pool'
import { useParamsSearch } from './useParamsSearch'

export const usePoolName = () => {
  const history = useHistory()
  const { poolName } = useParamsSearch() as {
    poolName: POOL_NAME
  }

  useEffect(() => {
    if (!poolName || !Object.values(POOL_NAME).includes(poolName)) {
      history.push('/')
    }
  }, [history, poolName])

  return poolName
}

export const usePoolChainCheck = () => {
  const history = useHistory()
  const { chainId } = useWeb3React()
  const { poolName } = useParamsSearch() as {
    poolName: POOL_NAME
  }

  useEffect(() => {
    if (chainId && poolName) {
      const config = PoolContractMap[chainId]
      const poolTypes = Object.keys(POOL_TYPE)
      // @ts-ignore
      if (poolTypes.every((poolType) => !config?.[poolType]?.[poolName])) {
        history.push('/')
      }
    }
  }, [chainId, history, poolName])

  return poolName
}

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
