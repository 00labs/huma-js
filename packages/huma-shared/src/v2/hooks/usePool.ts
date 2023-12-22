import { MaxUint256 } from '@ethersproject/constants'
import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import { BigNumber, Contract } from 'ethers'
import { useEffect, useState } from 'react'

import { useContract, useERC20Contract, useForceRefresh } from '../../hooks'
import { ChainEnum, getContract, isChainEnum, POOL_NAME } from '../../utils'
import FIRST_LOSS_COVER_ABI from '../abis/FirstLossCover.json'
import POOL_CONFIG_V2_ABI from '../abis/PoolConfig.json'
import RECEIVABLE_V2_ABI from '../abis/Receivable.json'
import {
  Credit,
  FirstLossCover,
  Pool,
  PoolConfig,
  PoolSafe,
  Receivable,
  TrancheVault,
} from '../abis/types'
import { CreditRecordStructOutput } from '../abis/types/Credit'
import {
  CreditConfigStructOutput,
  CreditManager,
} from '../abis/types/CreditManager'
import { FirstLossCoverIndex } from '../types'
import { BP_FACTOR } from '../utils/const'
import {
  CHAIN_POOLS_INFO_V2,
  PoolInfoV2,
  TrancheType,
  UnderlyingTokenInfo,
} from '../utils/pool'
import {
  getCreditConfig,
  getCreditHash,
  getCreditRecord,
  getPoolUnderlyingTokenBalanceV2,
  getPoolUnderlyingTokenInfoV2,
} from '../utils/poolContract'

export type CreditStatsV2 = {
  creditRecord?: CreditRecordStructOutput
  creditConfig?: CreditConfigStructOutput
  creditAvailable?: BigNumber
  payoffAmount?: BigNumber
}

export const usePoolInfoV2 = (
  poolName: POOL_NAME,
  chainId: ChainEnum | undefined,
): PoolInfoV2 | undefined => {
  if (isChainEnum(chainId)) {
    return CHAIN_POOLS_INFO_V2[chainId]?.[poolName]
  }
  return undefined
}

function usePoolContractV2(
  poolName: POOL_NAME,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  const chainId = provider?.network?.chainId
  const poolInfo = usePoolInfoV2(poolName, chainId)
  return useContract<Pool>(poolInfo?.pool, poolInfo?.poolAbi, provider)
}

function usePoolSafeContractV2(
  poolName: POOL_NAME,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  const chainId = provider?.network?.chainId
  const poolInfo = usePoolInfoV2(poolName, chainId)
  return useContract<PoolSafe>(
    poolInfo?.poolSafe,
    poolInfo?.poolSafeAbi,
    provider,
  )
}

export function usePoolConfigContractV2(
  poolName: POOL_NAME,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  const [poolConfig, setPoolConfig] = useState<string | undefined>()
  const chainId = provider?.network?.chainId
  const poolInfo = usePoolInfoV2(poolName, chainId)
  const poolContract = useContract<Pool>(
    poolInfo?.pool,
    poolInfo?.poolAbi,
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

  return useContract<PoolConfig>(poolConfig, POOL_CONFIG_V2_ABI, provider)
}

export function useTrancheVaultContractV2(
  poolName: POOL_NAME,
  trancheType: TrancheType,
  provider: JsonRpcProvider | Web3Provider | undefined,
  account?: string,
) {
  const chainId = provider?.network?.chainId
  const poolInfo = usePoolInfoV2(poolName, chainId)
  const contractAddr = poolInfo?.[`${trancheType}TrancheVault`]
  return useContract<TrancheVault>(
    contractAddr,
    poolInfo?.trancheVaultAbi,
    provider,
    account,
  )
}

export function useFirstLossCoverContractV2(
  poolName: POOL_NAME,
  firstLossCoverType: FirstLossCoverIndex,
  provider: JsonRpcProvider | Web3Provider | undefined,
  account?: string,
) {
  const chainId = provider?.network?.chainId
  const poolInfo = usePoolInfoV2(poolName, chainId)
  const firstLossCover = poolInfo?.firstLossCovers?.[firstLossCoverType]

  return useContract<FirstLossCover>(
    firstLossCover,
    FIRST_LOSS_COVER_ABI,
    provider,
    account,
  )
}

export function useCreditContractV2(
  poolName: POOL_NAME,
  provider: JsonRpcProvider | Web3Provider | undefined,
  account?: string,
) {
  const chainId = provider?.network?.chainId
  const poolInfo = usePoolInfoV2(poolName, chainId)
  return useContract<Credit>(
    poolInfo?.poolCredit,
    poolInfo?.poolCreditAbi,
    provider,
    account,
  )
}

export function useCreditManagerContractV2(
  poolName: POOL_NAME,
  provider: JsonRpcProvider | Web3Provider | undefined,
  account?: string,
) {
  const chainId = provider?.network?.chainId
  const poolInfo = usePoolInfoV2(poolName, chainId)
  return useContract<CreditManager>(
    poolInfo?.poolCreditManager,
    poolInfo?.poolCreditManagerAbi,
    provider,
    account,
  )
}

export function useReceivableContractV2(
  poolName: POOL_NAME,
  provider: JsonRpcProvider | Web3Provider | undefined,
  account?: string,
) {
  const poolConfigContract = usePoolConfigContractV2(poolName, provider)
  const [receivableContract, setReceivableContract] = useState<Receivable>()

  useEffect(() => {
    const fetchData = async () => {
      if (poolConfigContract) {
        const receivableAsset = await poolConfigContract.receivableAsset()
        const receivableAssetContract = getContract<Receivable>(
          receivableAsset,
          RECEIVABLE_V2_ABI,
          provider,
          account,
        )
        if (receivableAssetContract) {
          setReceivableContract(receivableAssetContract)
        }
      }
    }
    fetchData()
  }, [account, poolConfigContract, provider])

  return receivableContract
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
  provider: JsonRpcProvider | Web3Provider | undefined,
): [BigNumber | undefined, () => void] {
  const flcBorrowerContract = useFirstLossCoverContractV2(
    poolName,
    FirstLossCoverIndex.borrower,
    provider,
  )
  const flcAffiliateContract = useFirstLossCoverContractV2(
    poolName,
    FirstLossCoverIndex.affiliate,
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
  provider: JsonRpcProvider | Web3Provider | undefined,
): [BigNumber | undefined, () => void] {
  const poolSafeContract = usePoolSafeContractV2(poolName, provider)
  const [value, refresh] = useContractValueV2(poolSafeContract, 'totalAssets')
  return [value, refresh]
}

export function useTrancheVaultAssetsV2(
  poolName: POOL_NAME,
  trancheType: TrancheType,
  provider: JsonRpcProvider | Web3Provider | undefined,
): [BigNumber | undefined, () => void] {
  const trancheVaultContract = useTrancheVaultContractV2(
    poolName,
    trancheType,
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
  provider: JsonRpcProvider | Web3Provider | undefined,
): [Boolean | undefined, () => void] {
  const [approved, setApproved] = useState<boolean>()
  const [refreshCount, refresh] = useForceRefresh()
  const vaultContract = useTrancheVaultContractV2(
    poolName,
    trancheType,
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
  provider: JsonRpcProvider | Web3Provider | undefined,
): [BigNumber | undefined, () => void] {
  const [position, setPosition] = useState<BigNumber>()
  const vaultContract = useTrancheVaultContractV2(
    poolName,
    trancheType,
    provider,
  )
  const [refreshCount, refresh] = useForceRefresh()

  useEffect(() => {
    const fetchData = async () => {
      if (vaultContract && account) {
        const position = await vaultContract.totalAssetsOf(account)
        setPosition(position)
      }
    }
    fetchData()
  }, [account, vaultContract, refreshCount])

  return [position, refresh]
}

export function usePoolUnderlyingTokenContractV2(
  poolName: POOL_NAME,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  const poolConfig = usePoolConfigContractV2(poolName, provider)
  const [poolUnderlyingToken, setPoolUnderlyingToken] = useState<
    string | undefined
  >()

  useEffect(() => {
    if (poolConfig) {
      const fetchData = async () => {
        try {
          setPoolUnderlyingToken(await poolConfig.underlyingToken())
        } catch (err) {
          setPoolUnderlyingToken(undefined)
        }
      }

      fetchData()
    }
  }, [poolConfig])

  return useERC20Contract(poolUnderlyingToken, provider)
}

export function usePoolSafeAllowanceV2(
  poolName: POOL_NAME,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  const chainId = provider?.network?.chainId
  const poolInfo = usePoolInfoV2(poolName, chainId)
  const spender = poolInfo?.poolSafe
  const contract = usePoolUnderlyingTokenContractV2(poolName, provider)
  const [allowance, setAllowance] = useState<BigNumber>()
  const [autopayEnabled, setAutopayEnabled] = useState<boolean>()
  const [refreshCount, refresh] = useForceRefresh()

  useEffect(() => {
    const fetchData = async () => {
      if (contract && account && spender) {
        const allowance = await contract.allowance(account, spender)
        setAllowance(allowance)
        setAutopayEnabled(allowance.gt(MaxUint256.div(2)))
      }
    }
    fetchData()
  }, [account, contract, spender, refreshCount])

  return { autopayEnabled, allowance, refresh }
}

export function usePoolUnderlyingTokenInfoV2(
  poolName: POOL_NAME,
  provider: JsonRpcProvider | Web3Provider | undefined,
): UnderlyingTokenInfo | undefined {
  const [poolUnderlyingTokenInfo, setPoolUnderlyingTokenInfo] =
    useState<UnderlyingTokenInfo>()

  useEffect(() => {
    const fetchData = async () => {
      const poolUnderlyingTokenInfo = await getPoolUnderlyingTokenInfoV2(
        poolName,
        provider,
      )
      setPoolUnderlyingTokenInfo(poolUnderlyingTokenInfo)
    }

    fetchData()
  }, [poolName, provider])

  return poolUnderlyingTokenInfo
}

export function usePoolUnderlyingTokenBalanceV2(
  poolName: POOL_NAME,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): [BigNumber, () => void] {
  const contract = usePoolUnderlyingTokenContractV2(poolName, provider)
  const [balance = BigNumber.from(0), refresh] = useContractValueV2(
    contract,
    'balanceOf',
    account,
  )

  return [balance, refresh]
}

export const useFirstLossCoverAssetsV2 = (
  poolName: POOL_NAME,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): [BigNumber | undefined, () => void] => {
  const chainId = provider?.network?.chainId
  const poolInfo = usePoolInfoV2(poolName, chainId)
  const [totalAssets, setTotalAssets] = useState<BigNumber | undefined>()
  const poolConfigContract = usePoolConfigContractV2(poolName, provider)
  const [refreshCount, refresh] = useForceRefresh()

  useEffect(() => {
    if (account && poolInfo && poolConfigContract) {
      const fetchData = async () => {
        const firstLossCovers = await poolConfigContract.getFirstLossCovers()
        const firstLossCoverContracts = firstLossCovers
          .filter((item) => !!item)
          .map((item) =>
            getContract<FirstLossCover>(
              item,
              poolInfo.firstLossCoverAbi,
              provider,
            ),
          )
          .flatMap((item) => (item ? [item] : []))

        const firstLossCoverAssets = await Promise.all(
          firstLossCoverContracts.map((contract) =>
            contract.totalAssetsOf(account),
          ),
        )

        let totalAssets = BigNumber.from(0)
        firstLossCoverAssets.forEach((assets) => {
          totalAssets = totalAssets.add(assets)
        })
        setTotalAssets(totalAssets)
      }
      fetchData()
    }
  }, [account, poolConfigContract, poolInfo, provider, refreshCount])

  return [totalAssets, refresh]
}

export function useWithdrawableAssetsV2(
  poolName: POOL_NAME,
  trancheType: TrancheType,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): [BigNumber | undefined, () => void] {
  const vaultContract = useTrancheVaultContractV2(
    poolName,
    trancheType,
    provider,
  )
  const [withdrawableAssets, refresh] = useContractValueV2(
    vaultContract,
    'withdrawableAssets',
    account,
  )

  return [withdrawableAssets, refresh]
}

type RedemptionInfo = {
  shares: BigNumber
  amount: BigNumber
}

export function useCancellableRedemptionInfoV2(
  poolName: POOL_NAME,
  trancheType: TrancheType,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): [RedemptionInfo | undefined, () => void] {
  const [redemptionInfo, setRedemptionInfo] = useState<RedemptionInfo>()
  const vaultContract = useTrancheVaultContractV2(
    poolName,
    trancheType,
    provider,
  )
  const [refreshCount, refresh] = useForceRefresh()

  useEffect(() => {
    if (account && vaultContract) {
      const fetchData = async () => {
        const shares = await vaultContract.cancellableRedemptionShares(account)
        const amount = await vaultContract.convertToAssets(shares)
        setRedemptionInfo({ shares, amount })
      }
      fetchData()
    }
  }, [account, vaultContract, refreshCount])

  return [redemptionInfo, refresh]
}

export function useCreditStatsV2(
  poolName: POOL_NAME,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): [CreditStatsV2, () => void] {
  const chainId = provider?.network?.chainId
  const [creditStats, setCreditStats] = useState<CreditStatsV2>({})
  const [refreshCount, refresh] = useForceRefresh()

  useEffect(() => {
    const fetchData = async () => {
      if (account) {
        const creditHash = getCreditHash(poolName, chainId, account)
        if (creditHash) {
          const [creditRecord, creditConfig, poolTokenBalance] =
            await Promise.all([
              getCreditRecord(poolName, chainId, account, provider),
              getCreditConfig(poolName, chainId, account, provider),
              getPoolUnderlyingTokenBalanceV2(poolName, account, provider),
            ])
          if (creditRecord && creditConfig && poolTokenBalance) {
            const principal = creditRecord.unbilledPrincipal
              .add(creditRecord.nextDue)
              .add(creditRecord.totalPastDue)
            const unusedCredit = creditConfig.creditLimit.sub(principal)
            // Set available credit to the minimum of the pool balance or the credit available amount,
            // since both are upper bounds on the amount of credit that can be borrowed.
            // If either is negative, cap the available credit to 0.
            let creditAvailable = unusedCredit.lt(poolTokenBalance)
              ? unusedCredit
              : poolTokenBalance
            creditAvailable = creditAvailable.lt(0)
              ? BigNumber.from(0)
              : creditAvailable

            setCreditStats({
              creditRecord,
              creditConfig,
              creditAvailable,
              payoffAmount: creditRecord.unbilledPrincipal
                .add(creditRecord.nextDue)
                .add(creditRecord.totalPastDue),
            })
          }
        }
      }
    }
    fetchData()
  }, [account, chainId, poolName, provider, refreshCount])

  return [creditStats, refresh]
}

export function useFirstLossCoverSufficientV2(
  poolName: POOL_NAME,
  firstLossCoverIndex: FirstLossCoverIndex,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): [boolean | undefined, () => void] {
  const contract = useFirstLossCoverContractV2(
    poolName,
    firstLossCoverIndex,
    provider,
  )
  const [isSufficient, setIsSufficient] = useState<boolean>()
  const [refreshCount, refresh] = useForceRefresh()

  useEffect(() => {
    const fetchData = async () => {
      if (contract && account) {
        const isSufficient = await contract.isSufficient(account)
        setIsSufficient(isSufficient)
      }
    }
    fetchData()
  }, [account, contract, refreshCount])

  return [isSufficient, refresh]
}

export function useFirstLossCoverAllowanceV2(
  poolName: POOL_NAME,
  firstLossCoverType: FirstLossCoverIndex,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): [BigNumber | undefined, () => void] {
  const chainId = provider?.network?.chainId
  const poolInfo = usePoolInfoV2(poolName, chainId)
  const spender = poolInfo?.firstLossCovers?.[firstLossCoverType]
  const contract = usePoolUnderlyingTokenContractV2(poolName, provider)
  const [allowance, refresh] = useContractValueV2(contract, 'allowance', [
    account,
    spender,
  ])

  return [allowance, refresh]
}

export function useFirstLossCoverPositionV2(
  poolName: POOL_NAME,
  firstLossCoverIndex: FirstLossCoverIndex,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): [{ balance: BigNumber; assets: BigNumber } | undefined, () => void] {
  const contract = useFirstLossCoverContractV2(
    poolName,
    firstLossCoverIndex,
    provider,
  )
  const [invest, setInvest] = useState<{
    balance: BigNumber
    assets: BigNumber
  }>()
  const [refreshCount, refresh] = useForceRefresh()

  useEffect(() => {
    const fetchData = async () => {
      if (contract && account) {
        const balance = await contract.balanceOf(account)
        const assets = await contract.convertToAssets(balance)
        setInvest({
          balance,
          assets,
        })
      }
    }
    fetchData()
  }, [account, contract, refreshCount])

  return [invest, refresh]
}

type FirstLossCoverRequirement = {
  minRequirement: BigNumber
  minAmountToDeposit: BigNumber
  amountToDeposit: BigNumber
}

export const useFirstLossCoverRequirement = (
  poolName: POOL_NAME,
  firstLossCoverType: FirstLossCoverIndex,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): [FirstLossCoverRequirement | undefined, () => void] => {
  const [requirement, setRequirement] = useState<FirstLossCoverRequirement>()
  const poolContract = usePoolContractV2(poolName, provider)
  const poolConfigContract = usePoolConfigContractV2(poolName, provider)
  const firstLossCoverContract = useFirstLossCoverContractV2(
    poolName,
    firstLossCoverType,
    provider,
  )
  const [refreshCount, refresh] = useForceRefresh()

  useEffect(() => {
    const fetchData = async () => {
      if (
        account &&
        poolContract &&
        poolConfigContract &&
        firstLossCoverContract
      ) {
        const [
          lossCoverProviderConfig,
          lpConfig,
          poolValue,
          firstLossCoverAssets,
        ] = await Promise.all([
          firstLossCoverContract.getCoverProviderConfig(account),
          poolConfigContract.getLPConfig(),
          poolContract.totalAssets(),
          firstLossCoverContract.totalAssetsOf(account),
        ])

        const poolCap = lpConfig.liquidityCap
        const minFromPoolCap = poolCap
          .mul(lossCoverProviderConfig.poolCapCoverageInBps)
          .div(BP_FACTOR)
        const minFromPoolValue = poolValue
          .mul(lossCoverProviderConfig.poolValueCoverageInBps)
          .div(BP_FACTOR)
        const minRequirement = minFromPoolCap.gt(minFromPoolValue)
          ? minFromPoolCap
          : minFromPoolValue

        const minAmountToDeposit = minRequirement.gt(firstLossCoverAssets)
          ? minRequirement.sub(firstLossCoverAssets).add(1) // add 1 to round up
          : BigNumber.from(0)
        setRequirement({
          minRequirement,
          minAmountToDeposit,
          amountToDeposit: minAmountToDeposit.mul(2),
        })
      }
    }
    fetchData()
  }, [
    account,
    firstLossCoverContract,
    poolConfigContract,
    poolContract,
    refreshCount,
  ])

  return [requirement, refresh]
}
