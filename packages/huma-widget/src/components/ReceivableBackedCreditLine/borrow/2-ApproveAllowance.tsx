import { PoolInfoV2, UnderlyingTokenInfo } from '@huma-finance/shared'
import React, { useCallback } from 'react'

import { useAppDispatch } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ApproveAllowanceModalV2 } from '../../ApproveAllowanceModalV2'

type Props = {
  poolInfo: PoolInfoV2
  poolUnderlyingToken: UnderlyingTokenInfo
  needCreateReceivable: boolean
}

export function ApproveAllowance({
  poolInfo,
  poolUnderlyingToken,
  needCreateReceivable,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()

  const handleSuccess = useCallback(() => {
    dispatch(
      setStep(
        needCreateReceivable ? WIDGET_STEP.MintNFT : WIDGET_STEP.ApproveNFT,
      ),
    )
  }, [dispatch, needCreateReceivable])

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
