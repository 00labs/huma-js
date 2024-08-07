import { PoolInfoV2, UnderlyingTokenInfo } from '@huma-finance/core'
import React, { useCallback } from 'react'

import { PaymentType } from '.'
import { useAppDispatch } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ApproveAllowanceModalV2 } from '../../ApproveAllowanceModalV2'

type Props = {
  poolInfo: PoolInfoV2
  poolUnderlyingToken: UnderlyingTokenInfo
  paymentType: PaymentType
}

export function ApproveAllowance({
  poolInfo,
  poolUnderlyingToken,
  paymentType,
}: Props): React.ReactElement {
  const dispatch = useAppDispatch()

  const handleSuccess = useCallback(() => {
    const step =
      paymentType === PaymentType.PaymentWithReceivable
        ? WIDGET_STEP.Transfer
        : WIDGET_STEP.MintNFT

    dispatch(setStep(step))
  }, [dispatch, paymentType])

  return (
    <ApproveAllowanceModalV2
      poolInfo={poolInfo}
      spender={poolInfo.poolSafe}
      poolUnderlyingToken={poolUnderlyingToken}
      handleSuccess={handleSuccess}
      showAutoPayback
    />
  )
}
