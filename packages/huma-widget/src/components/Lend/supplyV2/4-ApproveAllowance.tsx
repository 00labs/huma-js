import {
  FirstLossCoverIndex,
  PoolInfoV2,
  UnderlyingTokenInfo,
} from '@huma-finance/shared'
import React, { useCallback } from 'react'

import { SupplyType } from '.'
import { useAppDispatch } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ApproveAllowanceModalV2 } from '../../ApproveAllowanceModalV2'

type Props = {
  poolInfo: PoolInfoV2
  poolUnderlyingToken: UnderlyingTokenInfo
  selectedSupplyType: SupplyType
}

export function ApproveAllowance({
  poolInfo,
  poolUnderlyingToken,
  selectedSupplyType,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  let spender = poolInfo.poolSafe
  if (selectedSupplyType.type === 'firstLossCover') {
    spender =
      poolInfo.firstLossCovers[
        Number(selectedSupplyType.value) as FirstLossCoverIndex
      ]
  }

  const handleSuccess = useCallback(() => {
    dispatch(setStep(WIDGET_STEP.Transfer))
  }, [dispatch])

  return (
    <ApproveAllowanceModalV2
      poolInfo={poolInfo}
      poolUnderlyingToken={poolUnderlyingToken}
      spender={spender}
      handleSuccess={handleSuccess}
    />
  )
}
