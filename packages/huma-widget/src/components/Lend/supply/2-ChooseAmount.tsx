import { BigNumber } from 'ethers'
import {
  PoolInfoType,
  timeUtil,
  toBigNumber,
  upScale,
} from '@huma-finance/shared'
import React, { useCallback, useState } from 'react'

import { useAppDispatch } from '../../../hooks/useRedux'
import { setStep, setSupplyAmount } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ChooseAmountModal } from '../../ChooseAmountModal'
import { getIcon } from '../../icons'

type Props = {
  allowance: BigNumber
  withdrawlLockoutSeconds: number | undefined
  underlyingTokenBalance: string
  poolInfo: PoolInfoType
}

export function ChooseAmount({
  allowance,
  withdrawlLockoutSeconds,
  underlyingTokenBalance,
  poolInfo,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { poolUnderlyingToken } = poolInfo
  const { symbol, decimals } = poolUnderlyingToken
  const [currentAmount, setCurrentAmount] = useState(0)
  const depositAmount = upScale<number>(currentAmount, decimals)
  const needApprove = toBigNumber(depositAmount).gt(allowance)
  const withdrawlLockoutDays = timeUtil.secondsToDays(withdrawlLockoutSeconds)

  const handleChangeAmount = useCallback(
    (newAmount: number) => {
      setCurrentAmount(newAmount)
      dispatch(setSupplyAmount(newAmount))
    },
    [dispatch],
  )

  const handleAction = useCallback(() => {
    const step = needApprove
      ? WIDGET_STEP.ApproveAllowance
      : WIDGET_STEP.Transfer
    dispatch(setStep(step))
  }, [dispatch, needApprove])
  return (
    <ChooseAmountModal
      title={`Supply ${symbol}`}
      description1='Choose Amount'
      description2={`Depositors need to wait for ${withdrawlLockoutDays.toFixed(
        0,
      )} days before withdrawal`}
      sliderMax={Number(underlyingTokenBalance)}
      currentAmount={currentAmount}
      tokenSymbol={symbol}
      handleChangeAmount={handleChangeAmount}
      handleAction={handleAction}
      actionText={needApprove ? 'approve allowance' : 'supply'}
      type='input'
      tokenIcon={getIcon(poolInfo.poolUnderlyingToken.icon)!}
      hideTerms
    />
  )
}
