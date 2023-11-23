import {
  POOL_NAME,
  usePoolInfoV2,
  usePoolSafeAllowanceV2,
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
import { Success } from './2-Success'

/**
 * Auto payback props V2
 * @typedef {Object} AutoPaybackPropsV2
 * @property {POOL_NAME} poolName The name of the pool.
 * @property {function():void} handleClose Function to notify to close the widget modal when user clicks the 'x' close button.
 * @property {function((number|undefined)):void|undefined} handleSuccess Optional function to notify that the credit line pool borrow action is successful.
 */
export interface AutoPaybackPropsV2 {
  poolName: keyof typeof POOL_NAME
  handleClose: () => void
  handleSuccess?: (blockNumber?: number) => void
}

export function AutoPaybackV2({
  poolName: poolNameStr,
  handleClose,
  handleSuccess,
}: AutoPaybackPropsV2): React.ReactElement | null {
  const dispatch = useDispatch()
  const poolName = POOL_NAME[poolNameStr]
  const { account, chainId, provider } = useWeb3React()
  const poolInfo = usePoolInfoV2(poolName, chainId)
  const poolUnderlyingToken = usePoolUnderlyingTokenInfoV2(poolName, provider)
  const { step, errorMessage } = useAppSelector(selectWidgetState)
  const { autopayEnabled } = usePoolSafeAllowanceV2(poolName, account, provider)

  useEffect(() => {
    if (!step && !autopayEnabled) {
      dispatch(setStep(WIDGET_STEP.ApproveAllowance))
    }
  }, [autopayEnabled, dispatch, step])

  if (!poolInfo || !poolUnderlyingToken || autopayEnabled === undefined) {
    return (
      <WidgetWrapper
        isOpen
        isLoading
        loadingTitle='Auto Payback'
        handleClose={handleClose}
        handleSuccess={handleSuccess}
      />
    )
  }

  return (
    <WidgetWrapper
      isOpen
      loadingTitle='Auto Payback'
      handleClose={handleClose}
      handleSuccess={handleSuccess}
    >
      {step === WIDGET_STEP.ApproveAllowance && (
        <ApproveAllowance
          poolInfo={poolInfo}
          poolUnderlyingToken={poolUnderlyingToken}
        />
      )}
      {step === WIDGET_STEP.Done && <Success handleAction={handleClose} />}
      {step === WIDGET_STEP.Error && (
        <ErrorModal
          title='Auto Payback'
          errorMessage={errorMessage}
          handleOk={handleClose}
        />
      )}
    </WidgetWrapper>
  )
}
