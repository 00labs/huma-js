import { PoolInfoType } from '@huma-finance/core'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { BigNumber } from 'ethers'

import { useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ApproveAllowanceModal } from '../../ApproveAllowanceModal'

type Props = {
  poolInfo: PoolInfoType
}

export function ApproveAllowance({
  poolInfo,
}: Props): React.ReactElement | null {
  const dispatch = useDispatch()
  const { borrowAmountBN: borrowAmountBNJson } =
    useAppSelector(selectWidgetState)
  const borrowAmountBN = BigNumber.from(borrowAmountBNJson)

  const handleSuccess = useCallback(() => {
    dispatch(setStep(WIDGET_STEP.Permit))
  }, [dispatch])

  return (
    <ApproveAllowanceModal
      poolInfo={poolInfo}
      allowanceAmount={borrowAmountBN!}
      handleSuccess={handleSuccess}
      spender={poolInfo.poolProcessor!}
    />
  )
}
