import { MaxUint256 } from '@ethersproject/constants'
import { BigNumber, Contract } from 'ethers'
import { useCallback, useEffect, useState } from 'react'

import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import BASE_FEE_MANAGER_ABI from '../abis/BaseFeeManager.json'
import {
  BaseCreditPool,
  BasePoolConfig,
  HDT,
  ReceivableFactoringPool,
} from '../abis/types'
import { BaseFeeManager } from '../abis/types/BaseFeeManager'
import { CreditState } from '../utils/credit'
import { downScale, toBigNumber, upScale } from '../utils/number'
import { POOL_NAME, POOL_TYPE } from '../utils/pool'
import { useContract, useERC20Contract } from './useContract'
import { useForceRefresh } from './useForceRefresh'
import { usePoolInfo } from './usePool'

export type CreditRecordType = {
  unbilledPrincipal: BigNumber
  dueDate: BigNumber
  correction: BigNumber
  totalDue: BigNumber
  feesAndInterestDue: BigNumber
  missedPeriods: number
  remainingPeriods: number
  state: number
}

export type CreditRecordStaticType = {
  creditLimit: BigNumber
  aprInBps: number
  intervalInDays: number
  defaultAmount: BigNumber
}

export type ReceivableInfoType = {
  receivableAsset: string
  receivableAmount: BigNumber
  receivableParam: BigNumber
}

export type FeesType = {
  _frontLoadingFeeFlat: BigNumber
  _frontLoadingFeeBps: BigNumber
  _lateFeeFlat: BigNumber
  _lateFeeBps: BigNumber
  _membershipFee: BigNumber
}

export type AccountStats = {
  creditRecord: CreditRecordType | undefined
  creditRecordStatic: CreditRecordStaticType | undefined
  receivableInfo: ReceivableInfoType | undefined
  isApproved: boolean
  payoffAmount: number
  principalAmount: number
  creditAvailableAmount: number
  totalDueAmount: number
}

export function usePoolContract<T extends Contract>(
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  const poolInfo = usePoolInfo(poolName, poolType, chainId)
  return useContract<T>(poolInfo?.pool, poolInfo?.poolAbi, provider)
}

export function useBaseConfigPoolContract<T extends Contract>(
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  const poolInfo = usePoolInfo(poolName, poolType, chainId)
  return useContract<T>(
    poolInfo?.basePoolConfig,
    poolInfo?.basePoolConfigAbi,
    provider,
  )
}

export function usePoolFeeManagerContract(
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  const poolInfo = usePoolInfo(poolName, poolType, chainId)
  return useContract<BaseFeeManager>(
    poolInfo?.poolFeeManager,
    BASE_FEE_MANAGER_ABI,
    provider,
  )
}

export function usePoolUnderlyingTokenContract(
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  const poolInfo = usePoolInfo(poolName, poolType, chainId)
  return useERC20Contract(poolInfo?.poolUnderlyingToken?.address, provider)
}

export function useHDTContract<T extends Contract>(
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  const poolInfo = usePoolInfo(poolName, poolType, chainId)
  return useContract<T>(poolInfo?.HDT?.address, poolInfo?.HDT?.abi, provider)
}

export function usePoolNFTContract<T extends Contract>(
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  const poolInfo = usePoolInfo(poolName, poolType, chainId)
  return useContract<T>(
    poolInfo?.assetAddress,
    poolInfo?.poolAssetAbi,
    provider,
  )
}

export function usePoolUnderlyingToken(
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  chainId: number | undefined,
): Partial<{
  address: string
  symbol: string
  decimals: number
}> {
  const poolInfo = usePoolInfo(poolName, poolType, chainId)
  return poolInfo?.poolUnderlyingToken || {}
}

export function usePoolUnderlyingTokenBalance(
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  chainId: number | undefined,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  const poolUnderlyingTokenContract = usePoolUnderlyingTokenContract(
    poolName,
    poolType,
    chainId,
    provider,
  )
  const [balance, setBalance] = useState<BigNumber>(toBigNumber(0))

  useEffect(() => {
    const fetchData = async () => {
      if (poolUnderlyingTokenContract && account) {
        const result = await poolUnderlyingTokenContract.balanceOf(account)
        setBalance(result)
      }
    }
    fetchData()
  }, [account, poolUnderlyingTokenContract])

  return balance
}

export function usePoolTotalValue(
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): [BigNumber | undefined, () => void] {
  const poolContract = usePoolContract(poolName, poolType, chainId, provider)
  const [totalValue, setTotalValue] = useState<BigNumber>()
  const [refreshCount, refresh] = useForceRefresh()

  useEffect(() => {
    const fetchData = async () => {
      if (chainId && poolContract) {
        const result = await poolContract.totalPoolValue()
        setTotalValue(result)
      }
    }
    fetchData()
  }, [chainId, poolContract, poolName, poolType, refreshCount])

  return [totalValue, refresh]
}

export function usePoolTotalSupply(
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): [BigNumber | undefined, () => void] {
  const contract = useHDTContract<HDT>(poolName, poolType, chainId, provider)
  const [totalSupply, setTotalSupply] = useState<BigNumber>()
  const [refreshCount, refresh] = useForceRefresh()

  useEffect(() => {
    const fetchData = async () => {
      if (chainId && contract) {
        const result = await contract.totalSupply()
        setTotalSupply(result)
      }
    }
    fetchData()
  }, [chainId, contract, poolName, poolType, refreshCount])

  return [totalSupply, refresh]
}

export function usePoolBalance(
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): [BigNumber | undefined, () => void] {
  const poolUnderlyingTokenContract = usePoolUnderlyingTokenContract(
    poolName,
    poolType,
    chainId,
    provider,
  )
  const poolInfo = usePoolInfo(poolName, poolType, chainId)
  const [balance, setBalance] = useState<BigNumber>()
  const [refreshCount, refresh] = useForceRefresh()

  useEffect(() => {
    const fetchData = async () => {
      if (poolUnderlyingTokenContract && poolInfo) {
        const result = await poolUnderlyingTokenContract.balanceOf(
          poolInfo.pool,
        )
        setBalance(result)
      }
    }
    fetchData()
  }, [
    chainId,
    poolInfo,
    poolName,
    poolType,
    poolUnderlyingTokenContract,
    refreshCount,
  ])

  return [balance, refresh]
}

export function useAccountStats(
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  chainId: number | undefined,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): [AccountStats, () => void] {
  const poolInfo = usePoolInfo(poolName, poolType, chainId)
  const poolContract = usePoolContract<ReceivableFactoringPool>(
    poolName,
    poolType,
    chainId,
    provider,
  )
  const [poolBalance] = usePoolBalance(poolName, poolType, chainId, provider)
  const [accountStats, setAccountStats] = useState<AccountStats>({
    creditRecord: undefined,
    creditRecordStatic: undefined,
    receivableInfo: undefined,
    isApproved: false,
    payoffAmount: 0,
    principalAmount: 0,
    creditAvailableAmount: 0,
    totalDueAmount: 0,
  })
  const [refreshCount, refresh] = useForceRefresh()

  useEffect(() => {
    const fetchData = async () => {
      if (poolContract && account && poolInfo && poolBalance) {
        const creditRecord = await poolContract.creditRecordMapping(account)
        const creditRecordStatic = await poolContract.creditRecordStaticMapping(
          account,
        )
        let receivableInfo
        if (poolContract.receivableInfoMapping) {
          receivableInfo = await poolContract.receivableInfoMapping(account)
        }
        const isApproved = creditRecord
          ? creditRecord.state >= CreditState.Approved
          : false

        const payoffWithoutCorrection = creditRecord.unbilledPrincipal.add(
          creditRecord.totalDue,
        )
        const payoff = payoffWithoutCorrection.add(creditRecord.correction)
        const principal = payoffWithoutCorrection.sub(
          creditRecord.feesAndInterestDue,
        )
        const unusedCredit = creditRecordStatic.creditLimit.sub(principal)
        // Set available credit to the minimum of the pool balance or the credit available amount,
        // since both are upper bounds on the amount of credit that can be borrowed.
        // If either is negative, cap the available credit to 0.
        let creditAvailable = unusedCredit.lt(poolBalance)
          ? unusedCredit
          : poolBalance
        creditAvailable = creditAvailable.lt(0)
          ? BigNumber.from(0)
          : creditAvailable

        const { decimals } = poolInfo.poolUnderlyingToken
        setAccountStats({
          creditRecord,
          creditRecordStatic,
          receivableInfo,
          isApproved,
          payoffAmount: downScale<number>(payoff.toString(), decimals),
          principalAmount: downScale<number>(principal.toString(), decimals),
          creditAvailableAmount: downScale<number>(
            creditAvailable.toString(),
            decimals,
          ),
          totalDueAmount: downScale<number>(
            creditRecord.totalDue.toString(),
            decimals,
          ),
        })
      }
    }
    fetchData()
  }, [account, poolBalance, poolContract, poolInfo, refreshCount])

  return [accountStats, refresh]
}

export function useCreditRecord(
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  chainId: number | undefined,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  const poolContract = usePoolContract<ReceivableFactoringPool>(
    poolName,
    poolType,
    chainId,
    provider,
  )

  const checkIsApproved = useCallback(async () => {
    if (poolContract && account) {
      const creditRecord = await poolContract.creditRecordMapping(account)
      const isApproved = creditRecord
        ? creditRecord.state >= CreditState.Approved
        : false
      return isApproved
    }
    return false
  }, [account, poolContract])

  return { checkIsApproved }
}

export function useFeeManager(
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  const poolInfo = usePoolInfo(poolName, poolType, chainId)
  const feeManagerContract = usePoolFeeManagerContract(
    poolName,
    poolType,
    chainId,
    provider,
  )
  const [fees, setFees] = useState<FeesType>()

  useEffect(() => {
    const fetchData = async () => {
      if (feeManagerContract) {
        const result = await feeManagerContract.getFees()
        setFees(result)
      }
    }
    fetchData()
  }, [feeManagerContract])

  /**
   * return fees charged without decimals
   */
  const getFeesCharged = useCallback(
    (requestedLoan: number) => {
      if (!fees || !requestedLoan || !poolInfo) {
        return 0
      }
      const { poolUnderlyingToken } = poolInfo
      const { decimals } = poolUnderlyingToken
      const { _frontLoadingFeeFlat: feeFlat, _frontLoadingFeeBps: feeBps } =
        fees

      // @TODO: Figure out why feeBps.div(10000) directly not work
      return feeBps
        .div(100)
        .mul(toBigNumber(requestedLoan))
        .div(100)
        .add(downScale(feeFlat.toNumber(), decimals))
        .toNumber()
    },
    [fees, poolInfo],
  )

  return { fees, getFeesCharged }
}

export function usePoolAllowance(
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  chainId: number | undefined,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  const poolInfo = usePoolInfo(poolName, poolType, chainId)
  const contract = usePoolUnderlyingTokenContract(
    poolName,
    poolType,
    chainId,
    provider,
  )
  const [allowance, setAllowance] = useState<BigNumber>(toBigNumber(0))
  const [approved, setApproved] = useState<boolean>(false)
  const [loaded, setLoaded] = useState<boolean>(false)
  const [refreshCount, refresh] = useForceRefresh()

  useEffect(() => {
    const fetchData = async () => {
      if (contract && poolInfo && account) {
        const allowance = await contract.allowance(account, poolInfo.pool)
        setAllowance(allowance)
        setApproved(allowance.gt(MaxUint256.div(2)))
        setLoaded(true)
      }
    }
    fetchData()
  }, [account, contract, poolInfo, refreshCount])

  return { approved, allowance, loaded, refresh }
}

export function useLenderPosition(
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  chainId: number | undefined,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): [BigNumber | undefined, () => void] {
  const poolInfo = usePoolInfo(poolName, poolType, chainId)
  const contract = useHDTContract<HDT>(poolName, poolType, chainId, provider)
  const [position, setPosition] = useState<BigNumber>()
  const [refreshCount, refresh] = useForceRefresh()

  useEffect(() => {
    const fetchData = async () => {
      if (contract && account && poolInfo) {
        const position = await contract.withdrawableFundsOf(account)
        const oneCentUSD = BigNumber.from(
          upScale('0.01', poolInfo.poolUnderlyingToken.decimals),
        )
        // if position is less than one cent USD, consider it 0
        if (position.lt(oneCentUSD)) {
          setPosition(BigNumber.from(0))
        } else {
          setPosition(position)
        }
      }
    }
    fetchData()
  }, [account, contract, poolInfo, refreshCount])

  return [position, refresh]
}

export function useLenderApproved(
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  chainId: number | undefined,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): [boolean | undefined, () => void] {
  const contract = usePoolContract<BaseCreditPool>(
    poolName,
    poolType,
    chainId,
    provider,
  )
  const [approved, setApproved] = useState<boolean>()
  const [refreshCount, refresh] = useForceRefresh()

  useEffect(() => {
    const fetchData = async () => {
      if (contract && account) {
        const approved = await contract.isApprovedLender(account)
        setApproved(approved)
      }
    }
    fetchData()
  }, [account, contract, refreshCount])

  return [approved, refresh]
}

export function useWithdrawlLockoutInSeconds(
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  const contract = useBaseConfigPoolContract<BasePoolConfig>(
    poolName,
    poolType,
    chainId,
    provider,
  )
  const [lockoutSeconds, setLockoutSeconds] = useState<number>()

  useEffect(() => {
    const fetchData = async () => {
      if (contract) {
        const seconds = await contract.withdrawalLockoutPeriodInSeconds()
        setLockoutSeconds(seconds.toNumber())
      }
    }
    fetchData()
  }, [contract])

  return lockoutSeconds
}

export function useLastDepositTime(
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  chainId: number | undefined,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  const contract = usePoolContract<BaseCreditPool>(
    poolName,
    poolType,
    chainId,
    provider,
  )
  const [lockoutSeconds, setLockoutSeconds] = useState<number>()

  useEffect(() => {
    const fetchData = async () => {
      if (contract && account) {
        const seconds = await contract.lastDepositTime(account)
        setLockoutSeconds(seconds.toNumber())
      }
    }
    fetchData()
  }, [account, contract])

  return lockoutSeconds
}

export function usePoolApr(
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  const poolInfo = usePoolInfo(poolName, poolType, chainId)
  const contract = useContract<BasePoolConfig>(
    poolInfo?.basePoolConfig,
    poolInfo?.basePoolConfigAbi,
    provider,
  )
  const [apr, setApr] = useState<number>()

  useEffect(() => {
    const fetchData = async () => {
      if (contract) {
        const aprInBps = await contract.poolAprInBps()
        setApr(aprInBps.toNumber() / 10000)
      }
    }
    fetchData()
  }, [contract])

  return apr
}
