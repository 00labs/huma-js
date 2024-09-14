import { SolanaPoolInfo, TrancheType } from '@huma-finance/shared'
import {
  SolanaPoolState,
  useLenderAccounts,
  useTrancheTokenAccounts,
} from '@huma-finance/web-shared'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { BN } from '@coral-xyz/anchor'
import { useAppSelector } from '../../../hooks/useRedux'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WidgetWrapper } from '../../WidgetWrapper'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ChooseAmount } from './2-ChooseAmount'
import { setStep } from '../../../store/widgets.reducers'
import { ErrorModal } from '../../ErrorModal'
import { ChooseTranche } from './1-ChooseTranche'
import { Done } from './4-Done'
import { Transfer } from './3-Transfer'

/**
 * Lend pool supply props
 * @typedef {Object} SolanaLendAddRedemptionProps
 * @property {SolanaPoolInfo} poolInfo The metadata of the pool.
 * @property {SolanaPoolState} poolState The current state config of the pool. * @property {function():void} handleClose Function to notify to close the widget modal when user clicks the 'x' close button.
 * @property {function():void|undefined} handleSuccess Optional function to notify that the lending pool supply action is successful.
 */
export interface SolanaLendAddRedemptionProps {
  poolInfo: SolanaPoolInfo
  poolState: SolanaPoolState
  handleClose: () => void
  handleSuccess?: () => void
}

export function SolanaLendAddRedemption({
  poolInfo,
  poolState,
  handleClose,
  handleSuccess,
}: SolanaLendAddRedemptionProps): React.ReactElement | null {
  const dispatch = useDispatch()
  const {
    seniorLenderStateAccount,
    juniorLenderStateAccount,
    loading: isLoadingLenderAccounts,
  } = useLenderAccounts(poolInfo.chainId, poolInfo.poolName)
  const {
    seniorTokenAccount,
    juniorTokenAccount,
    loading: isLoadingTokenAccounts,
  } = useTrancheTokenAccounts(poolInfo)
  const { step, errorMessage } = useAppSelector(selectWidgetState)
  const [selectedTranche, setSelectedTranche] = useState<TrancheType>()

  useEffect(() => {
    if (!step && !isLoadingLenderAccounts && !isLoadingTokenAccounts) {
      const seniorTrancheShares = new BN(
        seniorTokenAccount?.amount?.toString() ?? 0,
      )
      const juniorTrancheShares = new BN(
        juniorTokenAccount?.amount?.toString() ?? 0,
      )

      if (juniorTrancheShares.gtn(0) && seniorTrancheShares.lten(0)) {
        setSelectedTranche('junior')
        dispatch(setStep(WIDGET_STEP.ChooseAmount))
        return
      }

      if (seniorTrancheShares.gtn(0) && juniorTrancheShares.lten(0)) {
        setSelectedTranche('senior')
        dispatch(setStep(WIDGET_STEP.ChooseAmount))
        return
      }

      if (seniorTrancheShares.gtn(0) && juniorTrancheShares.gtn(0)) {
        dispatch(setStep(WIDGET_STEP.ChooseTranche))
      }
    }
  }, [
    dispatch,
    step,
    isLoadingLenderAccounts,
    isLoadingTokenAccounts,
    seniorTokenAccount?.amount,
    juniorTokenAccount?.amount,
  ])

  const title = 'Redemption'
  if (isLoadingLenderAccounts || isLoadingTokenAccounts) {
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
      {step === WIDGET_STEP.ChooseAmount && selectedTranche && (
        <ChooseAmount
          poolInfo={poolInfo}
          poolState={poolState}
          lenderState={
            selectedTranche === 'senior'
              ? seniorLenderStateAccount
              : juniorLenderStateAccount
          }
          selectedTranche={selectedTranche}
        />
      )}
      {step === WIDGET_STEP.Transfer && selectedTranche && (
        <Transfer poolInfo={poolInfo} selectedTranche={selectedTranche} />
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
