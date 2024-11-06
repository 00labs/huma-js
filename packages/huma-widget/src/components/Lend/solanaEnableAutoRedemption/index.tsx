import { CloseModalOptions, SolanaPoolInfo } from '@huma-finance/shared'
import { SolanaPoolState } from '@huma-finance/web-shared'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ErrorModal } from '../../ErrorModal'
import { WidgetWrapper } from '../../WidgetWrapper'
import { Transfer } from './2-Transfer'
import { Success } from './3-Success'
import { ApproveAllowance } from './1-ApproveAllowance'

/**
 * Lend pool supply props
 * @typedef {Object} SolanaEnableAutoRedemptionProps
 * @property {SolanaPoolInfo} poolInfo The metadata of the pool.
 * @property {SolanaPoolState} poolState The current state config of the pool.
 * @property {function((CloseModalOptions|undefined)):void} handleClose Function to notify to close the widget modal when user clicks the 'x' close button.
 * @property {function():void|undefined} handleSuccess Optional function to notify that the lending pool supply action is successful.
 */
export interface SolanaEnableAutoRedemptionProps {
  poolInfo: SolanaPoolInfo
  poolState: SolanaPoolState
  handleClose: (options?: CloseModalOptions) => void
  handleSuccess?: () => void
}

export function SolanaEnableAutoRedemption({
  poolInfo,
  poolState,
  handleClose,
  handleSuccess,
}: SolanaEnableAutoRedemptionProps): React.ReactElement | null {
  const dispatch = useDispatch()
  const { step, errorMessage } = useAppSelector(selectWidgetState)

  useEffect(() => {
    if (!step) {
      dispatch(setStep(WIDGET_STEP.ApproveAllowance))
    }
  }, [dispatch, step])

  return (
    <WidgetWrapper
      isOpen
      loadingTitle='Auto-Redemption'
      handleClose={handleClose}
      handleSuccess={handleSuccess}
    >
      {step === WIDGET_STEP.ApproveAllowance && (
        <ApproveAllowance poolState={poolState} />
      )}
      {step === WIDGET_STEP.Transfer && (
        <Transfer poolInfo={poolInfo} poolState={poolState} />
      )}
      {step === WIDGET_STEP.Done && (
        <Success
          poolInfo={poolInfo}
          poolState={poolState}
          handleAction={handleClose}
        />
      )}
      {step === WIDGET_STEP.Error && (
        <ErrorModal
          title='Auto-Redemption'
          errorReason='Sorry there was an error'
          errorMessage={errorMessage}
          handleOk={handleClose}
        />
      )}
    </WidgetWrapper>
  )
}
