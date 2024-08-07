import { PoolInfoType, upScale } from '@huma-shan/core'
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
  const { supplyAmount } = useAppSelector(selectWidgetState)
  const { decimals } = poolInfo.poolUnderlyingToken
  const supplyBigNumber = upScale<BigNumber>(
    BigNumber.from(supplyAmount!),
    decimals,
  )

  const handleSuccess = useCallback(() => {
    dispatch(setStep(WIDGET_STEP.Done))
  }, [dispatch])

  return (
    <TxSendModal
      poolInfo={poolInfo}
      method='deposit'
      params={[supplyBigNumber]}
      handleSuccess={handleSuccess}
    />
  )
}
