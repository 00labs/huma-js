import { PoolInfoType } from '@huma-finance/core'
import { txAtom } from '@huma-finance/web-core'
import { useResetAtom } from 'jotai/utils'
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
  const reset = useResetAtom(txAtom)
  const { borrowAmountBN: borrowAmountBNJson } =
    useAppSelector(selectWidgetState)
  const borrowAmountBN = BigNumber.from(borrowAmountBNJson)

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
