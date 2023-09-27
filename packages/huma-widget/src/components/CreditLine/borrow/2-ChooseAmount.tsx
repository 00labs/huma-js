import {
  AccountStats,
  PoolInfoType,
  useCLFeeManager,
  useCLPoolAllowance,
} from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import React, { useCallback, useState } from 'react'
import { ethers } from 'ethers'

import { useAppDispatch } from '../../../hooks/useRedux'
import { setBorrowInfo } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ChooseAmountModal } from '../../ChooseAmountModal'

type Props = {
  poolInfo: PoolInfoType
  accountStats: AccountStats
}

export function ChooseAmount({
  poolInfo,
  accountStats,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const { poolUnderlyingToken } = poolInfo
  const { symbol, decimals } = poolUnderlyingToken
  const { getFeesCharged } = useCLFeeManager(poolInfo.poolName)
  const [chargedFees, setChargedFees] = useState(0)
  const [currentAmount, setCurrentAmount] = useState(0)
  const { creditRecordStatic, creditAvailableAmount } = accountStats

  const { approved } = useCLPoolAllowance(poolInfo.poolName, account)
  const handleChangeAmount = useCallback(
    (newAmount: number) => {
      setCurrentAmount(newAmount)
      const newChargedFees = getFeesCharged(newAmount)
      setChargedFees(newChargedFees)
    },
    [getFeesCharged],
  )

  const handleAction = useCallback(() => {
    const nextStep = approved
      ? WIDGET_STEP.Transfer
      : WIDGET_STEP.ApproveAllowance

    dispatch(
      setBorrowInfo({
        borrowAmount: currentAmount,
        borrowAmountBN: ethers.utils
          .parseUnits(currentAmount.toString(), decimals)
          .toJSON(),
        chargedFees,
        nextStep,
      }),
    )
  }, [approved, chargedFees, currentAmount, decimals, dispatch])

  return (
    <ChooseAmountModal
      title='Borrow'
      description1='Choose Amount'
      sliderMax={creditAvailableAmount}
      currentAmount={currentAmount}
      tokenSymbol={symbol}
      topLeft='Origination Fee'
      topRight={`${chargedFees} ${symbol}`}
      downLeft='APR'
      downRight={`${creditRecordStatic!.aprInBps / 100}%`}
      handleChangeAmount={handleChangeAmount}
      handleAction={handleAction}
      actionText='borrow'
    />
  )
}
