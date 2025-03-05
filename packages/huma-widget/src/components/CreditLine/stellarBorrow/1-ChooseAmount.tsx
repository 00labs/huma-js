import { formatNumber, StellarPoolInfo } from '@huma-finance/shared'
import React, { useState } from 'react'
import { useAppDispatch } from '../../../hooks/useRedux'
import { setStep, setSupplyAmount } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { InputAmountModal } from '../../InputAmountModal'

type Props = {
  poolInfo: StellarPoolInfo
  creditAvailable: number
}

export function ChooseAmount({
  poolInfo,
  creditAvailable,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { symbol } = poolInfo.underlyingToken
  const [currentAmount, setCurrentAmount] = useState<number | string>(0)

  const handleChangeAmount = (newAmount: number) => {
    setCurrentAmount(newAmount)
    dispatch(setSupplyAmount(Number(newAmount)))
  }

  const handleAction = () => {
    dispatch(setStep(WIDGET_STEP.ApproveAllowance))
  }

  return (
    <InputAmountModal
      title='Borrow'
      subTitle='Choose Amount'
      tokenSymbol={symbol}
      currentAmount={currentAmount}
      handleChangeAmount={handleChangeAmount}
      maxAmount={creditAvailable}
      maxAmountTitle={`${String(
        formatNumber(creditAvailable),
      )} ${symbol} Available`}
      handleAction={handleAction}
      actionText='BORROW'
    />
  )
}
