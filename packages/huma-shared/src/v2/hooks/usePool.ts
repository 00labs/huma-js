import { useWeb3React } from '@web3-react/core'
import { BigNumber, Contract } from 'ethers'
import { useEffect, useState } from 'react'

import { useContract, useForceRefresh } from '../../hooks'
import { POOL_NAME } from '../../utils'
import { Pool } from '../abis/types/Pool'
import { POOLS_INFO_V2, PoolInfoV2 } from '../utils/pool'

export const usePoolInfoV2 = (poolName: POOL_NAME): PoolInfoV2 | undefined => {
  const { chainId } = useWeb3React()
  const poolInfo = chainId ? POOLS_INFO_V2[chainId]?.[poolName] : undefined
  return poolInfo
}

function usePoolContract<T extends Contract>(poolName: POOL_NAME) {
  const poolInfo = usePoolInfoV2(poolName)
  return useContract<T>(poolInfo?.pool, poolInfo?.poolAbi)
}

export function useContractValue<T>(
  contract: T | null,
  method: string,
): [BigNumber | undefined, () => void] {
  const { chainId } = useWeb3React()
  const [value, setValue] = useState<BigNumber>()
  const [refreshCount, refresh] = useForceRefresh()

  useEffect(() => {
    const fetchData = async () => {
      if (chainId && contract) {
        // @ts-ignore
        const result = await contract[method]()
        setValue(result)
      }
    }
    fetchData()
  }, [chainId, contract, method, refreshCount])

  return [value, refresh]
}

export function usePoolTotalAssetsV2(
  poolName: POOL_NAME,
): [BigNumber | undefined, () => void] {
  const poolContract = usePoolContract<Pool>(poolName)
  const [value, refresh] = useContractValue<Pool>(poolContract, 'totalAssets')
  return [value, refresh]
}
