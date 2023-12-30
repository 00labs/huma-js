import {
  PoolInfoV2,
  toBigNumber,
  UnderlyingTokenInfo,
  upScale,
  useCreditContractV2,
} from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import React, { useCallback } from 'react'

import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { LoadingModal } from '../../LoadingModal'
import { TxSendModalV2 } from '../../TxSendModalV2'
import { PaymentType } from '.'

type Props = {
  poolInfo: PoolInfoV2
  poolUnderlyingToken: UnderlyingTokenInfo
  paymentType: PaymentType
  paymentTokenId: string
  borrowTokenId?: string
}

export function Transfer({
  poolInfo,
  poolUnderlyingToken,
  paymentType,
  paymentTokenId,
  borrowTokenId,
}: Props): React.ReactElement {
  const dispatch = useAppDispatch()
  const { account, provider } = useWeb3React()
  const { paymentAmount } = useAppSelector(selectWidgetState)
  const { decimals } = poolUnderlyingToken
  const paymentAmountBN = toBigNumber(upScale(paymentAmount!, decimals))
  const creditContract = useCreditContractV2(
    poolInfo.poolName,
    provider,
    account,
  )
  const method =
    paymentType === PaymentType.PaymentWithReceivable
      ? 'makePaymentWithReceivable'
      : 'makePrincipalPaymentAndDrawdownWithReceivable'

  const params =
    paymentType === PaymentType.PaymentWithReceivable
      ? [account, paymentTokenId, paymentAmountBN]
      : [
          account,
          paymentTokenId,
          paymentAmountBN,
          { receivableAmount: paymentAmountBN, receivableId: borrowTokenId },
          paymentAmountBN,
        ]

  const handleSuccess = useCallback(() => {
    dispatch(setStep(WIDGET_STEP.Done))
  }, [dispatch])

  if (!account || !creditContract) {
    return <LoadingModal title='Pay' />
  }

  return (
    <TxSendModalV2
      title='Pay'
      contract={creditContract}
      method={method}
      params={params}
      handleSuccess={handleSuccess}
    />
  )
}
