import { CreditRecordType, downScale, PoolInfoType } from '@huma-finance/shared'
import React, { useCallback, useState } from 'react'

import { useAppDispatch } from '../../../hooks/useRedux'
import { setPaymentAmount, setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ChooseAmountModal } from '../../ChooseAmountModal'

type Props = {
  creditRecord: CreditRecordType
  poolInfo: PoolInfoType
}

export function ChooseAmount({
  creditRecord,
  poolInfo,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { symbol, decimals } = poolInfo.poolUnderlyingToken
  const totalDue = downScale<number>(creditRecord.totalDue.toString(), decimals)
  const [remainingDue, setRemainingDue] = useState(totalDue)
  const [currentAmount, setCurrentAmount] = useState(0)

  const handleChangeAmount = useCallback(
    (newAmount: number) => {
      setCurrentAmount(newAmount)
      const remainDueAmount = totalDue - newAmount
      setRemainingDue(remainDueAmount)
      dispatch(setPaymentAmount({ paymentAmount: newAmount, remainDueAmount }))
    },
    [dispatch, totalDue],
  )

  const handleAction = useCallback(() => {
    dispatch(setStep(WIDGET_STEP.Transfer))
  }, [dispatch])

  return (
    <ChooseAmountModal
      title='Make the payment'
      description1='Choose amount'
      sliderMax={totalDue}
      currentAmount={currentAmount}
      tokenSymbol={symbol}
      topLeft='Total Due'
      topRight={`${totalDue} ${symbol}`}
      downLeft='Remaining Due'
      downRight={`${remainingDue} ${symbol}`}
      handleChangeAmount={handleChangeAmount}
      handleAction={handleAction}
      actionText='make payment'
    />
  )
}
