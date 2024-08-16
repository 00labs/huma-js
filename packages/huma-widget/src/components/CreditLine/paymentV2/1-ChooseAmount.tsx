import {
  formatNumber,
  PoolInfoV2,
  toBigNumber,
  UnderlyingTokenInfo,
  upScale,
} from '@huma-finance/shared'
import { usePoolSafeAllowanceV2 } from '@huma-finance/web-shared'
import { useWeb3React } from '@web3-react/core'
import { BigNumber, ethers } from 'ethers'
import React, { useCallback, useEffect, useState } from 'react'

import { useAppDispatch } from '../../../hooks/useRedux'
import { setPaymentAmount, setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { InputAmountModal } from '../../InputAmountModal'
import { LoadingModal } from '../../LoadingModal'

type Props = {
  payoffAmount: BigNumber
  totalDueAmount: BigNumber
  poolInfo: PoolInfoV2
  poolUnderlyingToken: UnderlyingTokenInfo
}

export function ChooseAmount({
  payoffAmount: payoffAmountBN,
  totalDueAmount: totalDueAmountBN,
  poolInfo,
  poolUnderlyingToken,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { account, provider } = useWeb3React()
  const { symbol, decimals } = poolUnderlyingToken
  const [currentAmount, setCurrentAmount] = useState(0)
  const { allowance } = usePoolSafeAllowanceV2(
    poolInfo.poolName,
    account,
    provider,
  )
  const totalDueAmount = Number(
    ethers.utils.formatUnits(totalDueAmountBN, decimals),
  )
  const payoffAmount = Number(
    ethers.utils.formatUnits(payoffAmountBN, decimals),
  )

  useEffect(() => {
    setCurrentAmount(totalDueAmount)
  }, [totalDueAmount])

  useEffect(() => {
    setCurrentAmount(totalDueAmount)
    dispatch(setPaymentAmount({ paymentAmount: totalDueAmount }))
  }, [dispatch, totalDueAmount])

  const handleChangeAmount = useCallback(
    (newAmount: number) => {
      setCurrentAmount(newAmount)
      dispatch(setPaymentAmount({ paymentAmount: newAmount }))
    },
    [dispatch],
  )

  const handleAction = useCallback(() => {
    const payAmount = upScale(currentAmount, decimals)
    const step = toBigNumber(payAmount).gt(allowance!)
      ? WIDGET_STEP.ApproveAllowance
      : WIDGET_STEP.Transfer
    dispatch(setStep(step))
  }, [allowance, currentAmount, decimals, dispatch])

  if (!allowance) {
    return <LoadingModal title='Pay' />
  }

  return (
    <InputAmountModal
      title='Pay'
      subTitle='Enter Amount'
      tokenSymbol={symbol}
      currentAmount={currentAmount}
      handleChangeAmount={handleChangeAmount}
      maxAmount={payoffAmount}
      maxAmountText='Pay Off'
      info={`${formatNumber(totalDueAmount.toFixed(0))} Due`}
      handleAction={handleAction}
      actionText='PAY'
    />
  )
}
