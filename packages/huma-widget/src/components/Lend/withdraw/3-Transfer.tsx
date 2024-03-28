import { PoolInfoType, toBigNumber, upScale } from '@huma-finance/shared'
import React, { useCallback } from 'react'

import { BigNumber } from 'ethers'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { TxSendModal } from '../../TxSendModal'

type Props = {
  poolInfo: PoolInfoType
}

export function Transfer({ poolInfo }: Props): React.ReactElement {
  const dispatch = useAppDispatch()
  const { decimals } = poolInfo.poolUnderlyingToken
  const { withdrawAmount } = useAppSelector(selectWidgetState)
  const withdrawBigNumber = upScale<BigNumber>(
    toBigNumber(withdrawAmount!),
    decimals,
  )

  const handleSuccess = useCallback(() => {
    dispatch(setStep(WIDGET_STEP.Done))
  }, [dispatch])

  return (
    <TxSendModal
      poolInfo={poolInfo}
      method='withdraw'
      params={[withdrawBigNumber]}
      handleSuccess={handleSuccess}
    />
  )
}
