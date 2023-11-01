import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'

import { MaxUint256 } from '@ethersproject/constants'
import {
  BaseCreditPool,
  BasePoolConfig,
  HDT,
  ReceivableFactoringPool,
} from '../abis/types'
import { CreditState } from '../utils/credit'
import { downScale, upScale } from '../utils/number'
import { getPoolInfo, POOL_NAME, POOL_TYPE } from '../utils/pool'
import { useContract, useERC20Contract } from './useContract'
import { useForceRefresh } from './useForceRefresh'
import { AccountStats } from './usePoolContract'

export function usePoolBalanceCrossChain(
  chainId: number | undefined,
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  providers: { [chainId: number]: string },
): [BigNumber | undefined, () => void] {
  const poolInfo = getPoolInfo(chainId, poolType, poolName)
  const poolUnderlyingTokenContract = useERC20Contract(
    poolInfo?.poolUnderlyingToken?.address,
    true,
    chainId,
    providers,
  )
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
  }, [poolInfo, poolUnderlyingTokenContract, refreshCount])

  return [balance, refresh]
}

export function useLenderPositionCrossChain(
  chainId: number | undefined,
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  providers: { [chainId: number]: string },
  account?: string,
): [BigNumber | undefined, () => void] {
  const poolInfo = getPoolInfo(chainId, poolType, poolName)
  const contract = useContract<HDT>(
    poolInfo?.HDT?.address,
    poolInfo?.HDT?.abi,
    true,
    chainId,
    providers,
  )
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

export function usePoolAprCrossChain(
  chainId: number | undefined,
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  providers: { [chainId: number]: string },
) {
  const poolInfo = getPoolInfo(chainId, poolType, poolName)
  const contract = useContract<BasePoolConfig>(
    poolInfo?.basePoolConfig,
    poolInfo?.basePoolConfigAbi,
    true,
    chainId,
    providers,
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

export function useBorrowerApprovedCrossChain(
  chainId: number | undefined,
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  account: string | undefined,
  providers: { [chainId: number]: string },
): [boolean | undefined, () => void] {
  const poolInfo = getPoolInfo(chainId, poolType, poolName)
  const contract = useContract<BaseCreditPool>(
    poolInfo?.pool,
    poolInfo?.poolAbi,
    true,
    chainId,
    providers,
  )
  const [approved, setApproved] = useState<boolean>()
  const [refreshCount, refresh] = useForceRefresh()

  useEffect(() => {
    const fetchData = async () => {
      if (contract && account) {
        const approved = await contract.isApproved(account)
        setApproved(approved)
      }
    }
    fetchData()
  }, [account, contract, refreshCount])

  return [approved, refresh]
}

export function useAccountStatsCrossChain(
  chainId: number | undefined,
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  account: string | undefined,
  providers: { [chainId: number]: string },
): [AccountStats, () => void] {
  const poolInfo = getPoolInfo(chainId, poolType, poolName)
  const poolContract = useContract<ReceivableFactoringPool>(
    poolInfo?.pool,
    poolInfo?.poolAbi,
    true,
    chainId,
    providers,
  )
  const [poolBalance] = usePoolBalanceCrossChain(
    chainId,
    poolName,
    poolType,
    providers,
  )
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

export function usePoolAllowanceCrossChain(
  chainId: number | undefined,
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  account: string | undefined,
  providers: { [chainId: number]: string },
) {
  const poolInfo = getPoolInfo(chainId, poolType, poolName)
  const contract = useERC20Contract(
    poolInfo?.poolUnderlyingToken?.address,
    true,
    chainId,
    providers,
  )
  const [allowance, setAllowance] = useState<BigNumber>(BigNumber.from(0))
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
