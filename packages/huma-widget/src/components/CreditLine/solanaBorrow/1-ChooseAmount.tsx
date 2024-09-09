import {
  formatNumber,
  SOLANA_CHAIN_INFO,
  SolanaPoolInfo,
  SolanaTokenUtils,
} from '@huma-finance/shared'
import { CreditConfigAccount } from '@huma-finance/web-shared'
import React, { useCallback, useMemo, useState } from 'react'

import { BN } from '@coral-xyz/anchor'
import { Account } from '@solana/spl-token'
import { useAppDispatch } from '../../../hooks/useRedux'
import { setBorrowInfo } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { InputAmountModal } from '../../InputAmountModal'

type Props = {
  poolInfo: SolanaPoolInfo
  creditConfigAccount: CreditConfigAccount
  tokenAccount: Account
}

export function ChooseAmount({
  poolInfo,
  creditConfigAccount,
  tokenAccount,
}: Props): React.ReactElement {
  const dispatch = useAppDispatch()
  const { symbol, decimals } = poolInfo.underlyingMint
  const sentinel = useMemo(
    () => SOLANA_CHAIN_INFO[poolInfo.chainId].sentinel,
    [poolInfo.chainId],
  )
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
    if (!tokenAccount) {
      return
    }

    const borrowAmountBN = SolanaTokenUtils.parseUnits(
      String(currentAmount),
      decimals,
    )
    const nextStep =
      borrowAmountBN.gt(new BN(tokenAccount.delegatedAmount)) ||
      tokenAccount.delegate?.toString() !== sentinel
        ? WIDGET_STEP.ApproveAllowance
        : WIDGET_STEP.Transfer

    dispatch(
      setBorrowInfo({
        borrowAmount: currentAmount,
        borrowAmountBN,
        chargedFees: 0,
        nextStep,
      }),
    )
  }, [currentAmount, decimals, dispatch, sentinel, tokenAccount])

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
