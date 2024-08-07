import { PoolInfoType } from '@huma-finance/core'
import { BigNumberish } from 'ethers'
import React, { useCallback } from 'react'

import { useAppDispatch } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ApproveAllowanceModal } from '../../ApproveAllowanceModal'

type Props = {
  poolInfo: PoolInfoType
  amount?: BigNumberish
}

export function ApproveAllowance({
  poolInfo,
  amount,
}: Props): React.ReactElement {
  const dispatch = useAppDispatch()

  const handleSuccess = useCallback(() => {
    dispatch(setStep(WIDGET_STEP.Done))
  }, [dispatch])

  return (
    <ApproveAllowanceModal
      poolInfo={poolInfo}
      allowanceAmount={amount}
      handleSuccess={handleSuccess}
      resetAfterSuccess={false}
      showAutoPayback
    />
  )
}
