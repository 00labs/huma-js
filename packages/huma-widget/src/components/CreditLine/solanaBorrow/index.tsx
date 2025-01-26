import { SolanaPoolInfo } from '@huma-finance/shared'
import { SolanaPoolState, useBorrowerAccounts } from '@huma-finance/web-shared'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { useAppSelector } from '../../../hooks/useRedux'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WidgetWrapper } from '../../WidgetWrapper'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { setStep } from '../../../store/widgets.reducers'
import { ChooseAmount } from './1-ChooseAmount'
import { Transfer } from './2-Transfer'
import { Done } from './3-Done'
import { SolanaErrorModal } from '../../SolanaErrorModal'

/**
 * Lend pool supply props
 * @typedef {Object} SolanaBorrowProps
 * @property {SolanaPoolInfo} poolInfo The metadata of the pool.
 * @property {SolanaPoolState} poolState The current state config of the pool. * @property {function():void} handleClose Function to notify to close the widget modal when user clicks the 'x' close button.
 * @property {function():void|undefined} handleSuccess Optional function to notify that the lending pool supply action is successful.
 */
export interface SolanaBorrowProps {
  poolInfo: SolanaPoolInfo
  poolState: SolanaPoolState
  handleClose: () => void
  handleSuccess?: () => void
}

export function SolanaBorrow({
  poolInfo,
  poolState,
  handleClose,
  handleSuccess,
}: SolanaBorrowProps): React.ReactElement | null {
  const title = 'Borrow'
  const dispatch = useDispatch()
  const { step, errorMessage } = useAppSelector(selectWidgetState)
  const { creditConfigAccount } = useBorrowerAccounts(
    poolInfo.chainId,
    poolInfo.poolName,
  )

  useEffect(() => {
    if (!step && creditConfigAccount) {
      dispatch(setStep(WIDGET_STEP.ChooseAmount))
    }
  }, [creditConfigAccount, dispatch, step])

  if (!creditConfigAccount) {
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
      {step === WIDGET_STEP.ChooseAmount && creditConfigAccount && (
        <ChooseAmount
          poolInfo={poolInfo}
          creditConfigAccount={creditConfigAccount}
        />
      )}
      {step === WIDGET_STEP.Transfer && <Transfer poolInfo={poolInfo} />}
      {step === WIDGET_STEP.Done && (
        <Done
          poolInfo={poolInfo}
          poolState={poolState}
          handleAction={handleClose}
        />
      )}
      {step === WIDGET_STEP.Error && (
        <SolanaErrorModal
          chainId={poolInfo.chainId}
          title={title}
          errorReason='Sorry there was an error'
          errorMessage={errorMessage}
          handleOk={handleClose}
        />
      )}
    </WidgetWrapper>
  )
}
