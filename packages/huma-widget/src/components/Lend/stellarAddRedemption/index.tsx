import {
  CloseModalOptions,
  StellarPoolInfo,
  TrancheType,
} from '@huma-finance/shared'
import {
  StellarConnectionContext,
  StellarPoolState,
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
import { Transfer } from './2-Transfer'
import { Done } from './3-Done'

/**
 * Stellar add redemption props – request to withdraw (redeem) shares from a tranche.
 * @property {StellarPoolInfo} poolInfo The metadata of the pool.
 * @property {StellarPoolState} poolState The current state config of the pool.
 * @property {TrancheType} tranche The tranche to redeem from (junior or senior).
 * @property {function((CloseModalOptions|undefined)):void} handleClose Function to close the widget modal.
 * @property {function():void|undefined} handleSuccess Optional callback when redemption request succeeds.
 */
export interface StellarLendAddRedemptionProps {
  poolInfo: StellarPoolInfo
  poolState: StellarPoolState
  tranche: TrancheType
  handleClose: (options?: CloseModalOptions) => void
  handleSuccess?: () => void
}

export function StellarLendAddRedemption({
  poolInfo,
  poolState,
  tranche,
  handleClose,
  handleSuccess,
}: StellarLendAddRedemptionProps): React.ReactElement | null {
  const dispatch = useDispatch()
  const { address: stellarAddress } = useContext(StellarConnectionContext)
  const { step, errorMessage } = useAppSelector(selectWidgetState)

  useEffect(() => {
    if (!step && stellarAddress) {
      dispatch(setStep(WIDGET_STEP.ChooseAmount))
    }
  }, [dispatch, step, stellarAddress])

  const title = 'Redemption'

  return (
    <WidgetWrapper
      isOpen
      loadingTitle={title}
      handleClose={handleClose}
      handleSuccess={handleSuccess}
    >
      {step === WIDGET_STEP.ChooseAmount && (
        <ChooseAmount
          poolInfo={poolInfo}
          poolState={poolState}
          selectedTranche={tranche}
        />
      )}
      {step === WIDGET_STEP.Transfer && (
        <Transfer poolInfo={poolInfo} selectedTranche={tranche} />
      )}
      {step === WIDGET_STEP.Done && (
        <Done poolInfo={poolInfo} handleAction={handleClose} />
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
