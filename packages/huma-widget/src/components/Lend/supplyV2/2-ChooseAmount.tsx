import {
  PoolInfoV2,
  timeUtil,
  toBigNumber,
  upScale,
  usePoolUnderlyingTokenDetailsV2,
} from '@huma-finance/shared'
import { BigNumber } from 'ethers'
import React, { useCallback, useState } from 'react'

import { useAppDispatch } from '../../../hooks/useRedux'
import { setStep, setSupplyAmount } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ChooseAmountModal } from '../../ChooseAmountModal'
import { getIcon } from '../../icons'

type Props = {
  allowance: BigNumber
  withdrawalLockoutSeconds: number | undefined
  underlyingTokenBalance: string
  poolInfo: PoolInfoV2
}

export function ChooseAmount({
  allowance,
  withdrawalLockoutSeconds,
  underlyingTokenBalance,
  poolInfo,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { symbol, decimals } = usePoolUnderlyingTokenDetailsV2(
    poolInfo.poolName,
    poolInfo.chainId,
    {},
  )
  const [currentAmount, setCurrentAmount] = useState(0)
  const depositAmount = upScale<number>(currentAmount, decimals)
  const needApprove = toBigNumber(depositAmount).gt(allowance)
  const withdrawalLockoutDays = timeUtil.secondsToDays(withdrawalLockoutSeconds)

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
      description2={`Depositors need to wait for ${withdrawalLockoutDays.toFixed(
        0,
      )} days before withdrawal`}
      sliderMax={Number(underlyingTokenBalance)}
      currentAmount={currentAmount}
      tokenSymbol={symbol}
      handleChangeAmount={handleChangeAmount}
      handleAction={handleAction}
      actionText={needApprove ? 'approve allowance' : 'supply'}
      type='input'
      tokenIcon={getIcon(symbol) ?? undefined}
      hideTerms
    />
  )
}
