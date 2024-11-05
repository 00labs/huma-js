import {
  CloseModalOptions,
  STELLAR_CHAINS_INFO,
  StellarPoolInfo,
  TrancheType,
} from '@huma-finance/shared'
import {
  StellarConnectionContext,
  StellarPoolState,
  useStellarLender,
  useTokenBalance,
} from '@huma-finance/web-shared'
import React, { useContext, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ErrorModal } from '../../ErrorModal'
import { WidgetWrapper } from '../../WidgetWrapper'
import { ChooseTranche } from './2-ChooseTranche'
import { ChooseAmount } from './3-ChooseAmount'
import { Transfer } from './4-Transfer'

export interface Campaign {
  id: string
  campaignGroupId: string
}

/**
 * Lend pool supply props
 * @typedef {Object} StellarLendSupplyProps
 * @property {StellarPoolInfo} poolInfo The metadata of the pool.
 * @property {StellarPoolState} poolState The current state config of the pool.
 * @property {function((CloseModalOptions|undefined)):void} handleClose Function to notify to close the widget modal when user clicks the 'x' close button.
 * @property {function():void|undefined} handleSuccess Optional function to notify that the lending pool supply action is successful.
 */
export interface StellarLendSupplyProps {
  poolInfo: StellarPoolInfo
  poolState: StellarPoolState
  handleClose: (options?: CloseModalOptions) => void
  handleSuccess?: () => void
}

export function StellarLendSupply({
  poolInfo,
  poolState,
  handleClose,
  handleSuccess,
}: StellarLendSupplyProps): React.ReactElement | null {
  const dispatch = useDispatch()
  const { isUniTranche } = poolState
  const { address: stellarAddress } = useContext(StellarConnectionContext)
  const {
    isLoadingStellarLender,
    isJuniorApprovedLender,
    isSeniorApprovedLender,
  } = useStellarLender(stellarAddress, poolInfo)
  const chainMetadata = STELLAR_CHAINS_INFO[poolInfo.chainId]
  const { tokenBalance, isLoadingTokenBalance } = useTokenBalance(
    chainMetadata,
    poolInfo.underlyingToken.address,
    stellarAddress,
  )
  const { step, errorMessage } = useAppSelector(selectWidgetState)
  const [selectedTranche, setSelectedTranche] = useState<TrancheType>()

  useEffect(() => {
    if (!step && !isLoadingStellarLender && !isLoadingTokenBalance) {
      // if (!isJuniorApprovedLender && !isSeniorApprovedLender) {
      //   dispatch(setStep(WIDGET_STEP.Evaluation))
      //   return
      // }

      if (isJuniorApprovedLender && !isSeniorApprovedLender) {
        setSelectedTranche('junior')
        dispatch(setStep(WIDGET_STEP.ChooseAmount))
        return
      }

      if (isSeniorApprovedLender && !isJuniorApprovedLender) {
        setSelectedTranche('senior')
        dispatch(setStep(WIDGET_STEP.ChooseAmount))
        return
      }

      if (isJuniorApprovedLender && isSeniorApprovedLender) {
        dispatch(setStep(WIDGET_STEP.ChooseTranche))
      }
    }
  }, [
    dispatch,
    handleClose,
    poolInfo,
    step,
    isLoadingStellarLender,
    isJuniorApprovedLender,
    isSeniorApprovedLender,
    isLoadingTokenBalance,
  ])

  if (isLoadingStellarLender || isLoadingTokenBalance) {
    return (
      <WidgetWrapper
        isOpen
        isLoading
        loadingTitle='Supply'
        handleClose={handleClose}
        handleSuccess={handleSuccess}
      />
    )
  }

  return (
    <WidgetWrapper
      isOpen
      loadingTitle={`Supply ${poolInfo.underlyingToken.symbol}`}
      handleClose={handleClose}
      handleSuccess={handleSuccess}
    >
      {step === WIDGET_STEP.ChooseTranche && (
        <ChooseTranche
          poolUnderlyingToken={poolInfo.underlyingToken}
          selectedTranche={selectedTranche}
          changeTranche={setSelectedTranche}
        />
      )}
      {step === WIDGET_STEP.ChooseAmount && (
        <ChooseAmount
          poolInfo={poolInfo}
          poolState={poolState}
          tokenBalance={tokenBalance}
          selectedTranche={selectedTranche}
          isUniTranche={isUniTranche}
        />
      )}
      {step === WIDGET_STEP.Transfer && selectedTranche && (
        <Transfer
          poolInfo={poolInfo}
          poolState={poolState}
          selectedTranche={selectedTranche}
        />
      )}
      {/* {step === WIDGET_STEP.Done && (
        <Success
          poolInfo={poolInfo}
          poolState={poolState}
          campaign={poolState.campaign}
          handleAction={handleClose}
        />
      )} */}
      {step === WIDGET_STEP.Error && (
        <ErrorModal
          title='Supply'
          errorReason='Sorry there was an error'
          errorMessage={errorMessage}
          handleOk={handleClose}
        />
      )}
    </WidgetWrapper>
  )
}
