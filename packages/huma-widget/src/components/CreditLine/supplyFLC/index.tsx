import {
  FirstLossCoverIndex,
  POOL_NAME,
  useFirstLossCoverAllowanceV2,
  useFirstLossCoverRequirement,
  usePoolInfoV2,
  usePoolUnderlyingTokenInfoV2,
} from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ErrorModal } from '../../ErrorModal'
import { WidgetWrapper } from '../../WidgetWrapper'
import { ApproveAllowance } from './1-ApproveAllowance'
import { Success } from './3-Success'
import { Transfer } from './2-Transfer'

/**
 * Supply first loss cover props
 * @typedef {Object} SupplyFirstLossCoverProps
 * @property {POOL_NAME} poolName The name of the pool.
 * @property {function():void} handleClose Function to notify to close the widget modal when user clicks the 'x' close button.
 * @property {function((number|undefined)):void|undefined} handleSuccess Optional function to notify that the credit line pool borrow action is successful.
 */
export interface SupplyFirstLossCoverProps {
  poolName: keyof typeof POOL_NAME
  handleClose: () => void
  handleSuccess?: (blockNumber?: number) => void
}

export function SupplyFirstLossCover({
  poolName: poolNameStr,
  handleClose,
  handleSuccess,
}: SupplyFirstLossCoverProps): React.ReactElement | null {
  const dispatch = useDispatch()
  const poolName = POOL_NAME[poolNameStr]
  const { account, chainId, provider } = useWeb3React()
  const poolInfo = usePoolInfoV2(poolName, chainId)
  const poolUnderlyingToken = usePoolUnderlyingTokenInfoV2(poolName, provider)
  const { step, errorMessage } = useAppSelector(selectWidgetState)
  const [requirement] = useFirstLossCoverRequirement(
    poolName,
    FirstLossCoverIndex.borrower,
    account,
    provider,
  )
  const [allowance] = useFirstLossCoverAllowanceV2(
    poolName,
    FirstLossCoverIndex.borrower,
    account,
    provider,
  )
  const { minAmountToDeposit } = requirement || {}

  useEffect(() => {
    if (!step && minAmountToDeposit && allowance) {
      if (minAmountToDeposit.gt(allowance!)) {
        dispatch(setStep(WIDGET_STEP.ApproveAllowance))
      } else {
        dispatch(setStep(WIDGET_STEP.Transfer))
      }
    }
  }, [allowance, dispatch, minAmountToDeposit, step])

  if (!poolInfo || !poolUnderlyingToken || !minAmountToDeposit || !allowance) {
    return (
      <WidgetWrapper
        isOpen
        isLoading
        loadingTitle='Enable Pool'
        handleClose={handleClose}
        handleSuccess={handleSuccess}
      />
    )
  }

  return (
    <WidgetWrapper
      isOpen
      loadingTitle='Enable Pool'
      handleClose={handleClose}
      handleSuccess={handleSuccess}
    >
      {step === WIDGET_STEP.ApproveAllowance && (
        <ApproveAllowance
          poolInfo={poolInfo}
          poolUnderlyingToken={poolUnderlyingToken}
          amountToDeposit={minAmountToDeposit}
        />
      )}
      {step === WIDGET_STEP.Transfer && (
        <Transfer poolInfo={poolInfo} amountToDeposit={minAmountToDeposit} />
      )}
      {step === WIDGET_STEP.Done && (
        <Success
          poolUnderlyingToken={poolUnderlyingToken}
          handleAction={handleClose}
          amountToDeposit={minAmountToDeposit}
        />
      )}
      {step === WIDGET_STEP.Error && (
        <ErrorModal
          title='Enable Pool'
          errorMessage={errorMessage}
          handleOk={handleClose}
        />
      )}
    </WidgetWrapper>
  )
}
