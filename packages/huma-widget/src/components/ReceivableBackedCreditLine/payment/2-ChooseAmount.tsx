import {
  PoolInfoV2,
  toBigNumber,
  UnderlyingTokenInfo,
  upScale,
} from '@huma-finance/core'
import { usePoolSafeAllowanceV2 } from '@huma-finance/web-core'
import { useWeb3React } from '@web3-react/core'
import { BigNumber, ethers } from 'ethers'
import React, { useCallback, useState } from 'react'

import { PaymentType } from '.'
import { useAppDispatch } from '../../../hooks/useRedux'
import { setPaymentAmount, setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ChooseAmountModal } from '../../ChooseAmountModal'
import { LoadingModal } from '../../LoadingModal'

type Props = {
  payoffAmount: BigNumber
  poolInfo: PoolInfoV2
  poolUnderlyingToken: UnderlyingTokenInfo
  paymentType: PaymentType
}

export function ChooseAmount({
  payoffAmount: payoffAmountBN,
  poolInfo,
  poolUnderlyingToken,
  paymentType,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { account, provider } = useWeb3React()
  const { symbol, decimals } = poolUnderlyingToken
  const [currentAmount, setCurrentAmount] = useState(0)
  const { allowance } = usePoolSafeAllowanceV2(
    poolInfo.poolName,
    account,
    provider,
  )
  const payoffAmount = Number(
    ethers.utils.formatUnits(payoffAmountBN, decimals),
  )

  const handleChangeAmount = useCallback(
    (newAmount: number) => {
      setCurrentAmount(newAmount)
      dispatch(setPaymentAmount({ paymentAmount: newAmount }))
    },
    [dispatch],
  )

  const handleAction = useCallback(() => {
    const payAmount = upScale(currentAmount, decimals)
    if (toBigNumber(payAmount).gt(allowance!)) {
      dispatch(setStep(WIDGET_STEP.ApproveAllowance))
      return
    }

    const step =
      paymentType === PaymentType.PaymentWithReceivable
        ? WIDGET_STEP.Transfer
        : WIDGET_STEP.MintNFT
    dispatch(setStep(step))
  }, [allowance, currentAmount, decimals, dispatch, paymentType])

  if (!allowance) {
    return <LoadingModal title='Pay' />
  }

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
      hideTerms
    />
  )
}
