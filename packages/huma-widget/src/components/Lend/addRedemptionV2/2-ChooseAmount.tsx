import { formatNumber, UnderlyingTokenInfo } from '@huma-finance/shared'
import { ethers } from 'ethers'
import React, { useState } from 'react'

import { TrancheInfo } from '.'
import { useAppDispatch } from '../../../hooks/useRedux'
import {
  setRedeemAmount,
  setRedeemShares,
  setStep,
} from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { InputAmountModal } from '../../InputAmountModal'

type Props = {
  poolUnderlyingToken: UnderlyingTokenInfo
  trancheInfo: TrancheInfo
}

export function ChooseAmount({
  poolUnderlyingToken,
  trancheInfo,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { symbol } = poolUnderlyingToken
  const [currentAmount, setCurrentAmount] = useState<number>(0)
  const [currentShares, setCurrentShares] = useState<number>(0)
  const maxSharesFormatted = ethers.utils.formatUnits(
    trancheInfo.shares,
    poolUnderlyingToken.decimals,
  )
  const sharePrice =
    trancheInfo.assets.toNumber() / trancheInfo.shares.toNumber()

  const handleChangeShares = (newShares: number) => {
    const amount = Number(newShares) * sharePrice
    setCurrentShares(Number(newShares))
    setCurrentAmount(amount)
    dispatch(setRedeemShares(Number(newShares)))
    dispatch(setRedeemAmount(amount))
  }

  const handleAction = () => {
    dispatch(setStep(WIDGET_STEP.Transfer))
  }

  return (
    <InputAmountModal
      title='Redemption'
      subTitle={`Enter number of shares to redeem from ${trancheInfo.tranche} tranche`}
      tokenSymbol={symbol}
      currentAmount={currentShares}
      handleChangeAmount={handleChangeShares}
      maxAmount={maxSharesFormatted}
      info={`${String(formatNumber(currentAmount))} ${symbol}`}
      maxAmountTitle={`${formatNumber(maxSharesFormatted)} Shares`}
      suffix='Shares'
      handleAction={handleAction}
      actionText='REQUEST'
    />
  )
}
