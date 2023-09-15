import { useWeb3React } from '@web3-react/core'
import { BigNumber, Contract } from 'ethers'
import { useCallback, useEffect, useState } from 'react'

import { useContract, useForceRefresh } from '../../hooks'
import { isChainEnum, POOL_NAME } from '../../utils'
import { TrancheVault } from '../abis/types'
import { Pool } from '../abis/types/Pool'
import { PoolInfoV2, POOLS_INFO_V2, VaultType } from '../utils/pool'

export const usePoolInfoV2 = (poolName: POOL_NAME): PoolInfoV2 | undefined => {
  const { chainId } = useWeb3React()
  if (isChainEnum(chainId)) {
    return POOLS_INFO_V2[chainId]?.[poolName]
  }
  return undefined
}

function usePoolContract(poolName: POOL_NAME) {
  const poolInfo = usePoolInfoV2(poolName)
  return useContract<Pool>(poolInfo?.pool, poolInfo?.poolAbi)
}

function useTrancheVaultContract(poolName: POOL_NAME, vaultType: VaultType) {
  const poolInfo = usePoolInfoV2(poolName)
  const contractAddr = poolInfo?.[`${vaultType}TrancheVault`]
  return useContract<TrancheVault>(contractAddr, poolInfo?.trancheVaultAbi)
}

export function useContractValue(
  contract: Contract | null,
  method: string,
  params?: unknown,
): [BigNumber | undefined, () => void] {
  const { chainId } = useWeb3React()
  const [value, setValue] = useState<BigNumber>()
  const [refreshCount, refresh] = useForceRefresh()
  const [savedParams, setSavedParams] = useState<unknown | undefined>(params)

  useEffect(() => {
    if (JSON.stringify(params ?? '') !== JSON.stringify(savedParams ?? '')) {
      setSavedParams(params)
    }
  }, [savedParams, params])

  useEffect(() => {
    const fetchData = async () => {
      if (chainId && contract) {
        let result: BigNumber
        if (savedParams) {
          result = await contract[method](savedParams)
        } else {
          result = await contract[method]()
        }
        setValue(result)
      }
    }
    fetchData()
  }, [chainId, contract, method, savedParams, refreshCount])

  return [value, refresh]
}

export function usePoolTotalAssetsV2(
  poolName: POOL_NAME,
): [BigNumber | undefined, () => void] {
  const poolContract = usePoolContract(poolName)
  const [value, refresh] = useContractValue(poolContract, 'totalAssets')
  return [value, refresh]
}

export function useLenderPositionV2(poolName: POOL_NAME): {
  seniorBalance: BigNumber | undefined
  juniorBalance: BigNumber | undefined
  refresh: () => void
} {
  const { account } = useWeb3React()
  const seniorVaultContract = useTrancheVaultContract(poolName, 'senior')
  const juniorVaultContract = useTrancheVaultContract(poolName, 'junior')
  const [seniorBalance, refreshSenior] = useContractValue(
    seniorVaultContract,
    'balanceOf',
    account,
  )
  const [juniorBalance, refreshJunior] = useContractValue(
    juniorVaultContract,
    'balanceOf',
    account,
  )

  const refresh = useCallback(() => {
    refreshSenior()
    refreshJunior()
  }, [refreshJunior, refreshSenior])

  return { seniorBalance, juniorBalance, refresh }
}
