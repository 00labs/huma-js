import { BigNumber, Contract } from 'ethers'
import { useEffect, useState } from 'react'

import FIRST_LOSS_COVER_ABI from '../abis/FirstLossCover.json'
import POOL_CONFIG_V2_ABI from '../abis/PoolConfig.json'
import { useContract, useERC20Contract, useForceRefresh } from '../../hooks'
import { isChainEnum, POOL_NAME } from '../../utils'
import {
  PoolInfoV2,
  CHAIN_POOLS_INFO_V2,
  VaultType,
  FirstLossCoverIndex,
} from '../utils/pool'
import {
  PoolVault,
  TrancheVault,
  PoolConfig,
  FirstLossCover,
} from '../abis/types'

export type FALLBACK_PROVIDERS = { [chainId: number]: string }

export const usePoolInfoV2 = (
  poolName: POOL_NAME,
  chainId: number | undefined,
): PoolInfoV2 | undefined => {
  if (isChainEnum(chainId)) {
    return CHAIN_POOLS_INFO_V2[chainId]?.[poolName]
  }
  return undefined
}

function usePoolVaultContractV2(
  poolName: POOL_NAME,
  chainId: number | undefined,
  fallbackProviders: FALLBACK_PROVIDERS,
) {
  const poolInfo = usePoolInfoV2(poolName, chainId)
  return useContract<PoolVault>(
    poolInfo?.poolVault,
    poolInfo?.poolVaultAbi,
    true,
    chainId,
    fallbackProviders,
  )
}

function usePoolConfigContractV2(
  poolName: POOL_NAME,
  chainId: number | undefined,
  fallbackProviders: FALLBACK_PROVIDERS,
) {
  const [poolConfig, setPoolConfig] = useState<string | undefined>()
  const poolInfo = usePoolInfoV2(poolName, chainId)
  const poolContract = useContract<PoolVault>(
    poolInfo?.poolVault,
    poolInfo?.poolVaultAbi,
    true,
    chainId,
    fallbackProviders,
  )

  useEffect(() => {
    async function fetchData() {
      try {
        setPoolConfig(await poolContract?.poolConfig())
      } catch (err) {
        setPoolConfig(undefined)
      }
    }

    fetchData()
  }, [poolName, chainId, fallbackProviders, poolContract])

  return useContract<PoolConfig>(
    poolConfig,
    POOL_CONFIG_V2_ABI,
    true,
    chainId,
    fallbackProviders,
  )
}

export function usePoolUnderlyingTokenContractV2(
  poolName: POOL_NAME,
  chainId: number | undefined,
  fallbackProviders: FALLBACK_PROVIDERS,
) {
  const poolConfig = usePoolConfigContractV2(
    poolName,
    chainId,
    fallbackProviders,
  )
  const [poolUnderlyingToken, setPoolUnderlyingToken] = useState<
    string | undefined
  >()

  useEffect(() => {
    async function fetchData() {
      try {
        setPoolUnderlyingToken(await poolConfig?.underlyingToken())
      } catch (err) {
        setPoolUnderlyingToken(undefined)
      }
    }

    fetchData()
  }, [poolName, chainId, fallbackProviders, poolConfig])

  return useERC20Contract(poolUnderlyingToken, true, chainId, fallbackProviders)
}

export function usePoolUnderlyingTokenDetailsV2(
  poolName: POOL_NAME,
  chainId: number | undefined,
  fallbackProviders: FALLBACK_PROVIDERS,
): {
  address: string | undefined
  decimals: number | undefined
  symbol: string | undefined
} {
  const poolUnderlyingTokenContract = usePoolUnderlyingTokenContractV2(
    poolName,
    chainId,
    fallbackProviders,
  )
  const [address, setAddress] = useState<string | undefined>()
  const [symbol, setSymbol] = useState<string | undefined>()
  const [decimals, setDecimals] = useState<number | undefined>()

  useEffect(() => {
    async function fetchData() {
      try {
        setAddress(poolUnderlyingTokenContract?.address)
        setDecimals(await poolUnderlyingTokenContract?.decimals())
        setSymbol(await poolUnderlyingTokenContract?.symbol())
      } catch (err) {
        setAddress(undefined)
        setDecimals(undefined)
        setSymbol(undefined)
      }
    }

    fetchData()
  }, [poolName, chainId, fallbackProviders, poolUnderlyingTokenContract])

  return { address, decimals, symbol }
}

export function useTrancheVaultContractV2(
  poolName: POOL_NAME,
  vaultType: VaultType,
  chainId: number | undefined,
  fallbackProviders: FALLBACK_PROVIDERS,
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

export function useFirstLossCoverContractV2(
  poolName: POOL_NAME,
  firstLossCoverType: FirstLossCoverIndex,
  chainId: number | undefined,
  fallbackProviders: FALLBACK_PROVIDERS,
) {
  const poolConfig = usePoolConfigContractV2(
    poolName,
    chainId,
    fallbackProviders,
  )
  const [firstLossCover, setFirstLossCover] = useState<string | undefined>()

  useEffect(() => {
    async function fetchData() {
      try {
        setFirstLossCover(
          await poolConfig?.getFirstLossCover(firstLossCoverType),
        )
      } catch (err) {
        setFirstLossCover(undefined)
      }
    }

    fetchData()
  }, [poolName, chainId, fallbackProviders, poolConfig, firstLossCoverType])

  return useContract<FirstLossCover>(
    firstLossCover,
    FIRST_LOSS_COVER_ABI,
    true,
    chainId,
    fallbackProviders,
  )
}

export function useContractValueV2<T = BigNumber>(
  contract: Contract | null,
  method: string,
  params?: unknown,
): [T | undefined, () => void] {
  const [value, setValue] = useState<T>()
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
        let result: T
        if (Array.isArray(savedParams)) {
          result = await contract[method](...savedParams)
        } else if (savedParams) {
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

export function useFirstLossCoverTotalAssetsV2(
  poolName: POOL_NAME,
  chainId: number | undefined,
  fallbackProviders: FALLBACK_PROVIDERS,
): [BigNumber | undefined, () => void] {
  const flcBorrowerContract = useFirstLossCoverContractV2(
    poolName,
    FirstLossCoverIndex.borrower,
    chainId,
    fallbackProviders,
  )
  const flcAffiliateContract = useFirstLossCoverContractV2(
    poolName,
    FirstLossCoverIndex.affiliate,
    chainId,
    fallbackProviders,
  )
  const [assets, setAssets] = useState<BigNumber>()
  const [refreshCount, refresh] = useForceRefresh()

  useEffect(() => {
    const fetchData = async () => {
      const borrowerAssets = await flcBorrowerContract?.totalAssets()
      const affiliateAssets = await flcAffiliateContract?.totalAssets()

      setAssets(borrowerAssets?.add(affiliateAssets ?? 0))
    }
    fetchData()
  }, [refreshCount, flcBorrowerContract, flcAffiliateContract])

  return [assets, refresh]
}

export function usePoolVaultTotalAssetsV2(
  poolName: POOL_NAME,
  chainId: number | undefined,
  fallbackProviders: FALLBACK_PROVIDERS,
): [BigNumber | undefined, () => void] {
  const poolVaultContract = usePoolVaultContractV2(
    poolName,
    chainId,
    fallbackProviders,
  )
  const [value, refresh] = useContractValueV2(poolVaultContract, 'totalAssets')
  return [value, refresh]
}

export function useTrancheVaultAssetsV2(
  poolName: POOL_NAME,
  vaultType: VaultType,
  chainId: number | undefined,
  fallbackProviders: FALLBACK_PROVIDERS,
): [BigNumber | undefined, () => void] {
  const trancheVaultContract = useTrancheVaultContractV2(
    poolName,
    vaultType,
    chainId,
    fallbackProviders,
  )
  const [value, refresh] = useContractValueV2(
    trancheVaultContract,
    'totalAssets',
  )
  return [value, refresh]
}

export function useLenderApprovedV2(
  poolName: POOL_NAME,
  vaultType: VaultType,
  account: string | undefined,
  chainId: number | undefined,
  fallbackProviders: FALLBACK_PROVIDERS,
): [Boolean | undefined, () => void] {
  const [approved, setApproved] = useState<boolean>()
  const [refreshCount, refresh] = useForceRefresh()
  const vaultContract = useTrancheVaultContractV2(
    poolName,
    vaultType,
    chainId,
    fallbackProviders,
  )

  useEffect(() => {
    const fetchData = async () => {
      if (vaultContract && account) {
        const approved = await vaultContract.hasRole(
          vaultContract.LENDER_ROLE(),
          account,
        )
        setApproved(approved)
      }
    }
    fetchData()
  }, [account, refreshCount, vaultContract])

  return [approved, refresh]
}

export function useLenderPositionV2(
  poolName: POOL_NAME,
  vaultType: VaultType,
  account: string | undefined,
  chainId: number | undefined,
  fallbackProviders: FALLBACK_PROVIDERS,
): [BigNumber | undefined, () => void] {
  const vaultContract = useTrancheVaultContractV2(
    poolName,
    vaultType,
    chainId,
    fallbackProviders,
  )
  const [balance, refresh] = useContractValueV2(
    vaultContract,
    'balanceOf',
    account,
  )

  return [balance, refresh]
}

export function usePoolVaultAllowanceV2(
  poolName: POOL_NAME,
  account: string | undefined,
  chainId: number | undefined,
  fallbackProviders: FALLBACK_PROVIDERS,
): [BigNumber, () => void] {
  const poolInfo = usePoolInfoV2(poolName, chainId)
  const spender = poolInfo?.poolVault
  const contract = usePoolUnderlyingTokenContractV2(
    poolName,
    chainId,
    fallbackProviders,
  )
  const [allowance = BigNumber.from(0), refresh] = useContractValueV2(
    contract,
    'allowance',
    [account, spender],
  )

  return [allowance, refresh]
}

export function usePoolUnderlyingTokenBalanceV2(
  poolName: POOL_NAME,
  account: string | undefined,
  chainId: number | undefined,
  fallbackProviders: FALLBACK_PROVIDERS,
): [BigNumber, () => void] {
  const contract = usePoolUnderlyingTokenContractV2(
    poolName,
    chainId,
    fallbackProviders,
  )
  const [balance = BigNumber.from(0), refresh] = useContractValueV2(
    contract,
    'balanceOf',
    account,
  )

  return [balance, refresh]
}
