import { SolanaPoolInfo, TrancheType } from '@huma-finance/shared'
import { useLenderAccounts } from '@huma-finance/web-shared'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { BN } from '@coral-xyz/anchor'
import { useAppSelector } from '../../../hooks/useRedux'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WidgetWrapper } from '../../WidgetWrapper'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { setStep } from '../../../store/widgets.reducers'
import { ErrorModal } from '../../ErrorModal'
import { Transfer } from './2-Transfer'
import { ChooseTranche } from './1-ChooseTranche'
import { Done } from './3-Done'

/**
 * Lend pool supply props
 * @typedef {Object} SolanaLendCancelRedemptionProps
 * @property {SolanaPoolInfo} poolInfo The metadata of the pool.
 * @property {SolanaPoolState} poolState The current state config of the pool. * @property {function():void} handleClose Function to notify to close the widget modal when user clicks the 'x' close button.
 * @property {function():void|undefined} handleSuccess Optional function to notify that the lending pool supply action is successful.
 */
export interface SolanaLendCancelRedemptionProps {
  poolInfo: SolanaPoolInfo
  handleClose: () => void
  handleSuccess?: () => void
}

export function SolanaLendCancelRedemption({
  poolInfo,
  handleClose,
  handleSuccess,
}: SolanaLendCancelRedemptionProps): React.ReactElement | null {
  const dispatch = useDispatch()
  const {
    seniorLenderStateAccount,
    juniorLenderStateAccount,
    juniorLenderStateAccountPDA,
    seniorLenderStateAccountPDA,
    loading: isLoadingLenderAccounts,
  } = useLenderAccounts(poolInfo.chainId, poolInfo.poolName)
  const { step, errorMessage } = useAppSelector(selectWidgetState)
  const [selectedTranche, setSelectedTranche] = useState<TrancheType>()

  useEffect(() => {
    if (!step && !isLoadingLenderAccounts) {
      const seniorTrancheSharesRequested = new BN(
        seniorLenderStateAccount?.redemptionRecord.numSharesRequested ?? 0,
      )
      const juniorTrancheSharesRequested = new BN(
        juniorLenderStateAccount?.redemptionRecord.numSharesRequested ?? 0,
      )

      if (
        juniorTrancheSharesRequested.gtn(0) &&
        seniorTrancheSharesRequested.lten(0)
      ) {
        setSelectedTranche('junior')
        dispatch(setStep(WIDGET_STEP.Transfer))
        return
      }

      if (
        seniorTrancheSharesRequested.gtn(0) &&
        juniorTrancheSharesRequested.lten(0)
      ) {
        setSelectedTranche('senior')
        dispatch(setStep(WIDGET_STEP.Transfer))
        return
      }

      if (
        seniorTrancheSharesRequested.gtn(0) &&
        juniorTrancheSharesRequested.gtn(0)
      ) {
        dispatch(setStep(WIDGET_STEP.ChooseTranche))
      }
    }
  }, [
    dispatch,
    step,
    isLoadingLenderAccounts,
    seniorLenderStateAccount?.redemptionRecord.numSharesRequested,
    juniorLenderStateAccount?.redemptionRecord.numSharesRequested,
  ])

  const title = 'Cancel Redemption'
  if (isLoadingLenderAccounts) {
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
      {step === WIDGET_STEP.ChooseTranche && (
        <ChooseTranche
          selectedTranche={selectedTranche}
          changeTranche={setSelectedTranche}
        />
      )}
      {step === WIDGET_STEP.Transfer && selectedTranche && (
        <Transfer
          poolInfo={poolInfo}
          lenderState={
            selectedTranche === 'senior'
              ? seniorLenderStateAccount
              : juniorLenderStateAccount
          }
          lenderStatePDA={
            selectedTranche === 'senior'
              ? seniorLenderStateAccountPDA
              : juniorLenderStateAccountPDA
          }
          selectedTranche={selectedTranche}
        />
      )}
      {step === WIDGET_STEP.Done && selectedTranche && (
        <Done
          poolInfo={poolInfo}
          lenderState={
            selectedTranche === 'senior'
              ? seniorLenderStateAccount
              : juniorLenderStateAccount
          }
          selectedTranche={selectedTranche}
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
