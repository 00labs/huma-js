import { useWeb3React } from '@web3-react/core'
import { PoolInfoType, toBigNumber, upScale } from '@huma-finance/core'
import { useCLPoolAllowance } from '@huma-finance/web-core'
import React, { useCallback, useEffect, useState } from 'react'
import { BigNumber } from 'ethers'

import { useAppDispatch } from '../../../hooks/useRedux'
import { setPaymentAmount, setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ChooseAmountModal } from '../../ChooseAmountModal'

type Props = {
  payoffAmount: number
  totalDueAmount: number
  poolInfo: PoolInfoType
}

export function ChooseAmount({
  payoffAmount,
  totalDueAmount,
  poolInfo,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { account, chainId, provider } = useWeb3React()
  const { symbol, decimals } = poolInfo.poolUnderlyingToken
  const [currentAmount, setCurrentAmount] = useState(0)
  const { allowance } = useCLPoolAllowance(
    poolInfo.poolName,
    chainId,
    account,
    provider,
  )

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
    const payAmount = upScale<BigNumber>(toBigNumber(currentAmount), decimals)
    const step = payAmount.gt(allowance)
      ? WIDGET_STEP.ApproveAllowance
      : WIDGET_STEP.Transfer
    dispatch(setStep(step))
  }, [allowance, currentAmount, decimals, dispatch])

  return (
    <ChooseAmountModal
      title='Pay'
      description1='Choose amount'
      sliderMax={payoffAmount}
      currentAmount={currentAmount}
      tokenSymbol={symbol}
      handleChangeAmount={handleChangeAmount}
      handleAction={handleAction}
      actionText='pay'
      payoffAmount={payoffAmount}
      hideTerms
    />
  )
}
