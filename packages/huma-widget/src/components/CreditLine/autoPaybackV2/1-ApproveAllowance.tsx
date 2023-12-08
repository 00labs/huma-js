import { PoolInfoV2, UnderlyingTokenInfo } from '@huma-finance/shared'
import React from 'react'

import { useAppDispatch } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ApproveAllowanceModalV2 } from '../../ApproveAllowanceModalV2'

type Props = {
  poolInfo: PoolInfoV2
  poolUnderlyingToken: UnderlyingTokenInfo
}

export function ApproveAllowance({
  poolInfo,
  poolUnderlyingToken,
}: Props): React.ReactElement {
  const dispatch = useAppDispatch()

  const handleSuccess = () => {
    dispatch(setStep(WIDGET_STEP.Done))
  }

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