import { PoolInfoType, txAtom } from '@huma-finance/shared'
import { useResetAtom } from 'jotai/utils'
import React, { useCallback } from 'react'

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
  const reset = useResetAtom(txAtom)
  const { borrowAmountBN } = useAppSelector(selectWidgetState)

  const handleSuccess = useCallback(() => {
    reset()
    const nextStep = WIDGET_STEP.Done
    dispatch(setStep(nextStep))
  }, [dispatch, reset])

  return (
    <TxSendModal
      poolInfo={poolInfo}
      method='drawdown'
      params={[borrowAmountBN]}
      handleSuccess={handleSuccess}
    />
  )
}
