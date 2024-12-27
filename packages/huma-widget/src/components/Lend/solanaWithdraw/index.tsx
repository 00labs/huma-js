import { SolanaPoolInfo, TrancheType } from '@huma-finance/shared'
import { LenderStateAccount, SolanaPoolState } from '@huma-finance/web-shared'
import React, { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ErrorModal } from '../../ErrorModal'
import { WidgetWrapper } from '../../WidgetWrapper'
import { ConfirmTransfer } from './1-ConfirmTransfer'
import { Transfer } from './2-Transfer'
import { Done } from './3-Done'

/**
 * Solana lend pool withdraw props
 * @typedef {Object} SolanaLendWithdrawProps
 * @property {SolanaPoolInfo} poolInfo The metadata of the pool.
 * @property {SolanaPoolState} poolState The current state config of the pool.
 * @property {LenderStateAccount} lenderStateAccount The lender state account of the user.
 * @property {TrancheType} trancheType The type of the tranche.
 * @property {function():void} handleClose Function to notify to close the widget modal when user clicks the 'x' close button.
 * @property {function((number|undefined)):void|undefined} handleSuccess Optional function to notify that the lending pool withdraw action is successful.
 */
export type SolanaLendWithdrawProps = {
  poolInfo: SolanaPoolInfo
  poolState: SolanaPoolState
  lenderStateAccount: LenderStateAccount
  trancheType: TrancheType
  handleClose: () => void
  handleSuccess?: (blockNumber?: number) => void
}

export function SolanaLendWithdraw({
  poolInfo,
  poolState,
  lenderStateAccount,
  trancheType,
  handleClose,
  handleSuccess,
}: SolanaLendWithdrawProps): React.ReactElement | null {
  const dispatch = useDispatch()
  const { step, errorMessage } = useAppSelector(selectWidgetState)
  const title = `Withdraw ${poolInfo.underlyingMint.symbol}`
  const redemptionStatus = lenderStateAccount.redemptionRecord
  const poolIsClosed = poolState.status === 'closed'

  useEffect(() => {
    if (!step) {
      dispatch(setStep(WIDGET_STEP.ConfirmTransfer))
    }
  }, [dispatch, step])

  const handleWithdrawSuccess = useCallback(
    (blockNumber: number) => {
      if (handleSuccess) {
        handleSuccess(blockNumber)
      }
    },
    [handleSuccess],
  )

  return (
    <WidgetWrapper
      isOpen
      loadingTitle={title}
      handleClose={handleClose}
      handleSuccess={handleWithdrawSuccess}
    >
      {step === WIDGET_STEP.ConfirmTransfer && (
        <ConfirmTransfer
          poolInfo={poolInfo}
          tranche={trancheType}
          redemptionStatus={redemptionStatus}
          poolUnderlyingToken={poolUnderlyingToken}
          poolIsClosed={poolIsClosed}
        />
      )}
      {step === WIDGET_STEP.Transfer && (
        <Transfer
          poolInfo={poolInfo}
          tranche={trancheType}
          poolIsClosed={poolIsClosed}
        />
      )}
      {step === WIDGET_STEP.Done && (
        <Done
          poolUnderlyingToken={poolUnderlyingToken}
          withdrawAmount={redemptionStatus.withdrawableAssets}
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
