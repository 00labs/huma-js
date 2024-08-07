import {
  FirstLossCoverIndex,
  PoolInfoV2,
  UnderlyingTokenInfo,
} from '@huma-shan/core'
import { BigNumber } from 'ethers'
import React from 'react'

import { useAppDispatch } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ApproveAllowanceModalV2 } from '../../ApproveAllowanceModalV2'

type Props = {
  poolInfo: PoolInfoV2
  poolUnderlyingToken: UnderlyingTokenInfo
  amountToDeposit: BigNumber
}

export function ApproveAllowance({
  poolInfo,
  poolUnderlyingToken,
  amountToDeposit,
}: Props): React.ReactElement {
  const dispatch = useAppDispatch()

  const handleSuccess = () => {
    dispatch(setStep(WIDGET_STEP.Transfer))
  }

  return (
    <ApproveAllowanceModalV2
      poolInfo={poolInfo}
      spender={poolInfo.firstLossCovers[FirstLossCoverIndex.borrower]}
      poolUnderlyingToken={poolUnderlyingToken}
      allowanceAmount={amountToDeposit}
      handleSuccess={handleSuccess}
    />
  )
}
