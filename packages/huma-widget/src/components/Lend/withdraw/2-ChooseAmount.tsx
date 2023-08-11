import { BigNumber } from 'ethers'
import { downScale, PoolInfoType } from '@huma-finance/shared'
import React, { useCallback, useState } from 'react'

import { useAppDispatch } from '../../../hooks/useRedux'
import { setStep, setWithdrawAmount } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ChooseAmountModal } from '../../ChooseAmountModal'

type Props = {
  lenderPosition: BigNumber
  poolInfo: PoolInfoType
}

export function ChooseAmount({
  lenderPosition,
  poolInfo,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { poolUnderlyingToken } = poolInfo
  const { symbol, decimals } = poolUnderlyingToken
  const [currentAmount, setCurrentAmount] = useState(0)
  const withdrawableAmount = downScale<number>(lenderPosition, decimals)

  const handleChangeAmount = useCallback(
    (newAmount: number) => {
      setCurrentAmount(newAmount)
      dispatch(setWithdrawAmount(newAmount))
    },
    [dispatch],
  )

  const handleAction = useCallback(() => {
    dispatch(setStep(WIDGET_STEP.Transfer))
  }, [dispatch])

  return (
    <ChooseAmountModal
      title={`Withdraw ${symbol}`}
      description1='Choose Amount'
      sliderMax={Number(withdrawableAmount)}
      currentAmount={currentAmount}
      tokenSymbol={symbol}
      handleChangeAmount={handleChangeAmount}
      handleAction={handleAction}
      actionText='withdraw'
      hideTerms
    />
  )
}
