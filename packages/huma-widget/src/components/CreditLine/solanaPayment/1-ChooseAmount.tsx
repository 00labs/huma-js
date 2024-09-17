import {
  formatNumber,
  SolanaPoolInfo,
  SolanaTokenUtils,
} from '@huma-finance/shared'
import { CreditStateAccount } from '@huma-finance/web-shared'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { useAppDispatch } from '../../../hooks/useRedux'
import { setPaymentAmount, setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { InputAmountModal } from '../../InputAmountModal'

type Props = {
  poolInfo: SolanaPoolInfo
  creditStateAccount: CreditStateAccount
}

export function ChooseAmount({
  poolInfo,
  creditStateAccount,
}: Props): React.ReactElement {
  const dispatch = useAppDispatch()
  const { symbol, decimals } = poolInfo.underlyingMint
  const [currentAmount, setCurrentAmount] = useState<number>(0)
  const totalDueAmount = useMemo(
    () =>
      Number(
        SolanaTokenUtils.formatUnits(
          creditStateAccount.creditRecord.totalDueAmount,
          decimals,
        ),
      ),
    [creditStateAccount.creditRecord.totalDueAmount, decimals],
  )
  const payoffAmount = useMemo(
    () =>
      Number(
        SolanaTokenUtils.formatUnits(
          creditStateAccount.creditRecord.payoffAmount,
          decimals,
        ),
      ),
    [creditStateAccount.creditRecord.payoffAmount, decimals],
  )

  useEffect(() => {
    setCurrentAmount(totalDueAmount)
    dispatch(setPaymentAmount({ paymentAmount: totalDueAmount }))
  }, [dispatch, totalDueAmount])

  const handleChangeAmount = (newAmount: number) => {
    setCurrentAmount(newAmount)
    dispatch(setPaymentAmount({ paymentAmount: newAmount }))
  }

  const handleAction = useCallback(() => {
    dispatch(setStep(WIDGET_STEP.Transfer))
  }, [dispatch])

  return (
    <InputAmountModal
      title='Make Payment'
      subTitle='Choose Amount'
      tokenSymbol={symbol}
      currentAmount={currentAmount}
      handleChangeAmount={handleChangeAmount}
      maxAmount={payoffAmount}
      maxAmountText='Pay Off'
      infos={[`${formatNumber(totalDueAmount.toFixed(0))} Due`]}
      handleAction={handleAction}
      actionText='PAY'
    />
  )
}
