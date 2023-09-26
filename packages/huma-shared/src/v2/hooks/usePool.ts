import { BigNumber, Contract } from 'ethers'
import { useCallback, useEffect, useState } from 'react'

import { useContract, useForceRefresh } from '../../hooks'
import { isChainEnum, POOL_NAME } from '../../utils'
import { TrancheVault } from '../abis/types'
import { Pool } from '../abis/types/Pool'
import { PoolInfoV2, CHAIN_POOLS_INFO_V2, VaultType } from '../utils/pool'

export type FALLBACK_PROVIDERS = { [chainId: number]: string }

export const usePoolInfoV2 = (
  poolName: POOL_NAME,
  chainId: number,
): PoolInfoV2 | undefined => {
  if (isChainEnum(chainId)) {
    return CHAIN_POOLS_INFO_V2[chainId]?.[poolName]
  }
  return undefined
}

function usePoolContract(
  poolName: POOL_NAME,
  chainId: number,
  fallbackProviders?: FALLBACK_PROVIDERS,
) {
  const poolInfo = usePoolInfoV2(poolName, chainId)
  return useContract<Pool>(
    poolInfo?.pool,
    poolInfo?.poolAbi,
    true,
    chainId,
    fallbackProviders,
  )
}

function useTrancheVaultContract(
  poolName: POOL_NAME,
  vaultType: VaultType,
  chainId: number,
  fallbackProviders?: FALLBACK_PROVIDERS,
) {
  const poolInfo = usePoolInfoV2(poolName, chainId)
  const contractAddr = poolInfo?.[`${vaultType}TrancheVault`]
  return useContract<TrancheVault>(
    contractAddr,
    poolInfo?.trancheVaultAbi,
    true,
    chainId,
    fallbackProviders,
  )
}

export function useContractValue(
  contract: Contract | null,
  method: string,
  params?: unknown,
): [BigNumber | undefined, () => void] {
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
      if (contract) {
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
  }, [contract, method, savedParams, refreshCount])

  return [value, refresh]
}

export function usePoolTotalAssetsV2(
  poolName: POOL_NAME,
  chainId: number,
  fallbackProviders?: FALLBACK_PROVIDERS,
): [BigNumber | undefined, () => void] {
  const poolContract = usePoolContract(poolName, chainId, fallbackProviders)
  const [value, refresh] = useContractValue(poolContract, 'totalAssets')
  return [value, refresh]
}

export function useLenderPositionV2(
  poolName: POOL_NAME,
  account: string | undefined,
  chainId: number,
  fallbackProviders?: FALLBACK_PROVIDERS,
): {
  seniorBalance: BigNumber | undefined
  juniorBalance: BigNumber | undefined
  refresh: () => void
} {
  const seniorVaultContract = useTrancheVaultContract(
    poolName,
    'senior',
    chainId,
    fallbackProviders,
  )
  const juniorVaultContract = useTrancheVaultContract(
    poolName,
    'junior',
    chainId,
    fallbackProviders,
  )
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
