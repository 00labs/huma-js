import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import { BigNumber, Contract } from 'ethers'
import { useEffect, useState } from 'react'

import { useForceRefresh } from '../../hooks'
import {
  useContractCrossChain,
  useERC20ContractCrossChain,
} from '../../hooks/useContractCrossChain'
import { isChainEnum, POOL_NAME } from '../../utils'
import FIRST_LOSS_COVER_ABI from '../abis/FirstLossCover.json'
import POOL_CONFIG_V2_ABI from '../abis/PoolConfig.json'
import {
  FirstLossCover,
  PoolConfig,
  PoolSafe,
  TrancheVault,
} from '../abis/types'
import {
  CHAIN_POOLS_INFO_V2,
  FirstLossCoverIndex,
  PoolInfoV2,
  TrancheType,
} from '../utils/pool'

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

function usePoolSafeContractV2(
  poolName: POOL_NAME,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  const poolInfo = usePoolInfoV2(poolName, chainId)
  return useContractCrossChain<PoolSafe>(
    poolInfo?.poolSafe,
    poolInfo?.poolSafeAbi,
    provider,
  )
}

function usePoolConfigContractV2(
  poolName: POOL_NAME,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  const [poolConfig, setPoolConfig] = useState<string | undefined>()
  const poolInfo = usePoolInfoV2(poolName, chainId)
  const poolContract = useContractCrossChain<PoolSafe>(
    poolInfo?.poolSafe,
    poolInfo?.poolSafeAbi,
    provider,
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
  }, [poolContract])

  return useContractCrossChain<PoolConfig>(
    poolConfig,
    POOL_CONFIG_V2_ABI,
    provider,
  )
}

export function usePoolUnderlyingTokenContractV2(
  poolName: POOL_NAME,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  const poolInfo = usePoolInfoV2(poolName, chainId)
  return useERC20ContractCrossChain(
    poolInfo?.poolUnderlyingToken.address,
    provider,
  )
}

export function useTrancheVaultContractV2(
  poolName: POOL_NAME,
  trancheType: TrancheType,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
  account?: string,
) {
  const poolInfo = usePoolInfoV2(poolName, chainId)
  const contractAddr = poolInfo?.[`${trancheType}TrancheVault`]
  return useContractCrossChain<TrancheVault>(
    contractAddr,
    poolInfo?.trancheVaultAbi,
    provider,
    account,
  )
}

export function useFirstLossCoverContractV2(
  poolName: POOL_NAME,
  firstLossCoverType: FirstLossCoverIndex,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  const poolConfig = usePoolConfigContractV2(poolName, chainId, provider)
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
  }, [firstLossCoverType, poolConfig])

  return useContractCrossChain<FirstLossCover>(
    firstLossCover,
    FIRST_LOSS_COVER_ABI,
    provider,
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
  provider: JsonRpcProvider | Web3Provider | undefined,
): [BigNumber | undefined, () => void] {
  const flcBorrowerContract = useFirstLossCoverContractV2(
    poolName,
    FirstLossCoverIndex.borrower,
    chainId,
    provider,
  )
  const flcAffiliateContract = useFirstLossCoverContractV2(
    poolName,
    FirstLossCoverIndex.affiliate,
    chainId,
    provider,
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

export function usePoolSafeTotalAssetsV2(
  poolName: POOL_NAME,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): [BigNumber | undefined, () => void] {
  const poolSafeContract = usePoolSafeContractV2(poolName, chainId, provider)
  const [value, refresh] = useContractValueV2(poolSafeContract, 'totalAssets')
  return [value, refresh]
}

export function useTrancheVaultAssetsV2(
  poolName: POOL_NAME,
  trancheType: TrancheType,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): [BigNumber | undefined, () => void] {
  const trancheVaultContract = useTrancheVaultContractV2(
    poolName,
    trancheType,
    chainId,
    provider,
  )
  const [value, refresh] = useContractValueV2(
    trancheVaultContract,
    'totalAssets',
  )
  return [value, refresh]
}

export function useLenderApprovedV2(
  poolName: POOL_NAME,
  trancheType: TrancheType,
  account: string | undefined,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): [Boolean | undefined, () => void] {
  const [approved, setApproved] = useState<boolean>()
  const [refreshCount, refresh] = useForceRefresh()
  const vaultContract = useTrancheVaultContractV2(
    poolName,
    trancheType,
    chainId,
    provider,
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
  trancheType: TrancheType,
  account: string | undefined,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): [BigNumber | undefined, () => void] {
  const vaultContract = useTrancheVaultContractV2(
    poolName,
    trancheType,
    chainId,
    provider,
  )
  const [balance, refresh] = useContractValueV2(
    vaultContract,
    'balanceOf',
    account,
  )

  return [balance, refresh]
}

export function usePoolSafeAllowanceV2(
  poolName: POOL_NAME,
  account: string | undefined,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): [BigNumber, () => void] {
  const poolInfo = usePoolInfoV2(poolName, chainId)
  const spender = poolInfo?.poolSafe
  const contract = usePoolUnderlyingTokenContractV2(poolName, chainId, provider)
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
  provider: JsonRpcProvider | Web3Provider | undefined,
): [BigNumber, () => void] {
  const contract = usePoolUnderlyingTokenContractV2(poolName, chainId, provider)
  const [balance = BigNumber.from(0), refresh] = useContractValueV2(
    contract,
    'balanceOf',
    account,
  )

  return [balance, refresh]
}