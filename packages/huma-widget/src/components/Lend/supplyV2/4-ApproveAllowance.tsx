import { PoolInfoV2 } from '@huma-finance/shared'
import React, { useCallback } from 'react'

import { useAppDispatch } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ApproveAllowanceModalV2 } from '../../ApproveAllowanceModalV2'

type Props = {
  poolInfo: PoolInfoV2
}

export function ApproveAllowance({
  poolInfo,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const spender = poolInfo.poolSafe

  const handleSuccess = useCallback(() => {
    dispatch(setStep(WIDGET_STEP.Transfer))
  }, [dispatch])

  return (
    <ApproveAllowanceModalV2
      poolInfo={poolInfo}
      spender={spender}
      handleSuccess={handleSuccess}
    />
  )
}
