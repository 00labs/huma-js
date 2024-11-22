import {
  formatNumber,
  SolanaPoolInfo,
  SolanaTokenUtils,
} from '@huma-finance/shared'
import { CreditConfigAccount } from '@huma-finance/web-shared'
import React, { useCallback, useMemo, useState } from 'react'

import { useAppDispatch } from '../../../hooks/useRedux'
import { setBorrowInfo } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { InputAmountModal } from '../../InputAmountModal'

type Props = {
  poolInfo: SolanaPoolInfo
  creditConfigAccount: CreditConfigAccount
}

export function ChooseAmount({
  poolInfo,
  creditConfigAccount,
}: Props): React.ReactElement {
  const dispatch = useAppDispatch()
  const { symbol, decimals } = poolInfo.underlyingMint
  const [currentAmount, setCurrentAmount] = useState<number>(0)
  const creditAvailable = useMemo(
    () =>
      SolanaTokenUtils.formatUnits(
        creditConfigAccount.creditAvailable,
        decimals,
      ),
    [creditConfigAccount.creditAvailable, decimals],
  )

  const handleChangeAmount = (newAmount: number) => {
    setCurrentAmount(newAmount)
  }

  const handleAction = useCallback(() => {
    const borrowAmountBN = SolanaTokenUtils.parseUnits(
      String(currentAmount),
      decimals,
    )
    dispatch(
      setBorrowInfo({
        borrowAmount: currentAmount,
        borrowAmountBN: JSON.parse(borrowAmountBN.toString()),
        chargedFees: 0,
        nextStep: WIDGET_STEP.Transfer,
      }),
    )
  }, [currentAmount, decimals, dispatch])

  return (
    <InputAmountModal
      title='Borrow'
      subTitle='Choose Amount'
      tokenSymbol={symbol}
      currentAmount={currentAmount}
      handleChangeAmount={handleChangeAmount}
      maxAmount={creditAvailable}
      infos={[`${String(formatNumber(creditAvailable))} ${symbol} Available`]}
      handleAction={handleAction}
      actionText='BORROW'
    />
  )
}
