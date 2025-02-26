import { CloseModalOptions, StellarPoolInfo } from '@huma-finance/shared'
import {
  StellarConnectionContext,
  StellarPoolState,
  useStellarBorrower,
} from '@huma-finance/web-shared'
import React, { useContext, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ErrorModal } from '../../ErrorModal'
import { WidgetWrapper } from '../../WidgetWrapper'
import { ChooseAmount } from './1-ChooseAmount'
import { ApproveAllowance } from './2-ApproveAllowance'
import { Transfer } from './3-Transfer'
import { Success } from './4-Success'

/**
 * Stellar pool borrow widget props
 * @typedef {Object} StellarBorrowProps
 * @property {StellarPoolInfo} poolInfo The metadata of the pool.
 * @property {StellarPoolState} poolState The current state config of the pool.
 * @property {function((CloseModalOptions|undefined)):void} handleClose Function to notify to close the widget modal when user clicks the 'x' close button.
 * @property {function():void|undefined} handleSuccess Optional function to notify that the lending pool supply action is successful.
 */
export interface StellarBorrowProps {
  poolInfo: StellarPoolInfo
  poolState: StellarPoolState
  handleClose: (options?: CloseModalOptions) => void
  handleSuccess?: () => void
}

export function StellarBorrow({
  poolInfo,
  poolState,
  handleClose,
  handleSuccess,
}: StellarBorrowProps): React.ReactElement | null {
  const title = 'Borrow'
  const dispatch = useDispatch()
  const { address: stellarAddress } = useContext(StellarConnectionContext)
  const { creditAvailable, isLoadingStellarBorrower } = useStellarBorrower(
    stellarAddress,
    poolInfo,
  )
  const { step, errorMessage } = useAppSelector(selectWidgetState)

  useEffect(() => {
    if (!step && !isLoadingStellarBorrower) {
      dispatch(setStep(WIDGET_STEP.ChooseAmount))
    }
  }, [dispatch, handleClose, poolInfo, step, isLoadingStellarBorrower])

  if (isLoadingStellarBorrower) {
    return (
      <WidgetWrapper
        isOpen
        isLoading
        loadingTitle={title}
        handleClose={handleClose}
        handleSuccess={handleSuccess}
      />
    )
  }

  return (
    <WidgetWrapper
      isOpen
      loadingTitle={title}
      handleClose={handleClose}
      handleSuccess={handleSuccess}
    >
      {step === WIDGET_STEP.ChooseAmount && (
        <ChooseAmount poolInfo={poolInfo} creditAvailable={creditAvailable} />
      )}
      {step === WIDGET_STEP.ApproveAllowance && (
        <ApproveAllowance poolInfo={poolInfo} />
      )}
      {step === WIDGET_STEP.Transfer && <Transfer poolInfo={poolInfo} />}
      {step === WIDGET_STEP.Done && (
        <Success
          poolInfo={poolInfo}
          poolState={poolState}
          handleAction={handleClose}
        />
      )}
      {step === WIDGET_STEP.Error && (
        <ErrorModal
          title={title}
          errorReason='Sorry there was an error'
          errorMessage={errorMessage}
          handleOk={handleClose}
        />
      )}
    </WidgetWrapper>
  )
}
