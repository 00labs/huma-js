import { PoolInfoType, toBigNumber, upScale } from '@huma-finance/shared'
import React, { useCallback } from 'react'

import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { TxSendModal } from '../../TxSendModal'

type Props = {
  poolInfo: PoolInfoType
  tokenId: string
}

export function Transfer({ poolInfo, tokenId }: Props): React.ReactElement {
  const dispatch = useAppDispatch()
  const { decimals } = poolInfo.poolUnderlyingToken
  const { borrowAmount } = useAppSelector(selectWidgetState)
  const requestLoanBigNumber = toBigNumber(upScale(borrowAmount!, decimals))

  const handleSuccess = useCallback(() => {
    dispatch(setStep(WIDGET_STEP.Done))
  }, [dispatch])

  return (
    <TxSendModal
      poolInfo={poolInfo}
      title='Transfer Invoice and Money'
      method='drawdownWithReceivable'
      params={[requestLoanBigNumber, poolInfo.assetAddress, tokenId]}
      handleSuccess={handleSuccess}
    />
  )
}
