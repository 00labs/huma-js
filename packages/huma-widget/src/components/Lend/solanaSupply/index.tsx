import {
  CloseModalOptions,
  getSolanaNetworkType,
  SolanaPoolInfo,
  TrancheType,
} from '@huma-finance/shared'
import {
  LoggingContext,
  LoggingContextHelper,
  SolanaPoolState,
  useLenderAccounts,
  useTokenAccount,
} from '@huma-finance/web-shared'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { useAppSelector } from '../../../hooks/useRedux'
import { setLoggingContext, setStep } from '../../../store/widgets.reducers'
import {
  selectWidgetLoggingContext,
  selectWidgetState,
} from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { PointsEarned } from '../../PointsEarned'
import { WidgetWrapper } from '../../WidgetWrapper'
import { Evaluation } from './1-Evaluation'
import { ApproveLender } from './2-ApproveLender'
import { ChooseTranche } from './3-ChooseTranche'
import { ChooseAmount } from './4-ChooseAmount'
import { ApproveAllowance } from './5-ApproveAllowance'
import { Transfer } from './6-Transfer'
import { Success } from './7-Success'
import { SolanaErrorModal } from '../../SolanaErrorModal'

export interface Campaign {
  id: string
  campaignGroupId: string
}

/**
 * Lend pool supply props
 * @typedef {Object} SolanaLendSupplyProps
 * @property {SolanaPoolInfo} poolInfo The metadata of the pool.
 * @property {SolanaPoolState} poolState The current state config of the pool.
 * @param {string} documentHash The subscription file hash.
 * @property {function((CloseModalOptions|undefined)):void} handleClose Function to notify to close the widget modal when user clicks the 'x' close button.
 * @property {function():void|undefined} handleSuccess Optional function to notify that the lending pool supply action is successful.
 */
export interface SolanaLendSupplyProps {
  poolInfo: SolanaPoolInfo
  poolState: SolanaPoolState
  documentHash: string
  handleClose: (options?: CloseModalOptions) => void
  handleSuccess?: () => void
}

export function SolanaLendSupply({
  poolInfo,
  poolState,
  documentHash,
  handleClose,
  handleSuccess,
}: SolanaLendSupplyProps): React.ReactElement | null {
  const dispatch = useDispatch()
  const { isUniTranche } = poolState
  const {
    seniorLenderApproved,
    juniorLenderApproved,
    loading: isLoadingLenderAccounts,
  } = useLenderAccounts(poolInfo.chainId, poolInfo.poolName)
  const [tokenAccount, isLoadingTokenAccount] = useTokenAccount(poolInfo)
  const { step, errorMessage } = useAppSelector(selectWidgetState)
  const loggingHelper = useAppSelector(selectWidgetLoggingContext)
  const [selectedTranche, setSelectedTranche] = useState<TrancheType>()

  const handleCloseFlow = (options?: CloseModalOptions) => {
    loggingHelper.logAction('ExitFlow', {})
    handleClose(options)
  }

  useEffect(() => {
    if (!step && !isLoadingLenderAccounts && !isLoadingTokenAccount) {
      // Set initial logging context
      const context: LoggingContext = {
        flow: 'Supply',
        chainId: poolInfo.chainId,
        poolName: poolInfo.poolName,
        poolType: poolInfo.poolType,
      }
      const loggingHelperInit = new LoggingContextHelper(context)
      loggingHelperInit.logAction('StartFlow', {})
      dispatch(setLoggingContext(context))

      if (!juniorLenderApproved && !seniorLenderApproved) {
        loggingHelperInit.logAction('SetInitialStep', {
          step: WIDGET_STEP.Evaluation,
        })
        dispatch(setStep(WIDGET_STEP.Evaluation))
        return
      }

      if (!isUniTranche && (!juniorLenderApproved || !seniorLenderApproved)) {
        loggingHelperInit.logAction('SetInitialStep', {
          step: WIDGET_STEP.ApproveLender,
        })
        dispatch(setStep(WIDGET_STEP.ApproveLender))
        return
      }

      if (juniorLenderApproved && !seniorLenderApproved) {
        loggingHelperInit.logAction('SetInitialStep', {
          step: WIDGET_STEP.ChooseAmount,
          tranche: 'junior',
        })
        setSelectedTranche('junior')
        dispatch(setStep(WIDGET_STEP.ChooseAmount))
        return
      }

      if (seniorLenderApproved && !juniorLenderApproved) {
        loggingHelperInit.logAction('SetInitialStep', {
          step: WIDGET_STEP.ChooseAmount,
          tranche: 'senior',
        })
        setSelectedTranche('senior')
        dispatch(setStep(WIDGET_STEP.ChooseAmount))
        return
      }

      if (juniorLenderApproved && seniorLenderApproved) {
        loggingHelperInit.logAction('SetInitialStep', {
          step: WIDGET_STEP.ChooseTranche,
        })
        dispatch(setStep(WIDGET_STEP.ChooseTranche))
      }
    }
  }, [
    dispatch,
    handleClose,
    poolInfo,
    step,
    isLoadingLenderAccounts,
    juniorLenderApproved,
    seniorLenderApproved,
    isLoadingTokenAccount,
    isUniTranche,
  ])

  if (isLoadingLenderAccounts || isLoadingTokenAccount) {
    return (
      <WidgetWrapper
        isOpen
        isLoading
        loadingTitle='Supply'
        handleClose={handleCloseFlow}
        handleSuccess={handleSuccess}
      />
    )
  }

  return (
    <WidgetWrapper
      isOpen
      loadingTitle={`Supply ${poolInfo.underlyingMint.symbol}`}
      handleClose={handleCloseFlow}
      handleSuccess={handleSuccess}
    >
      {step === WIDGET_STEP.Evaluation && (
        <Evaluation
          poolInfo={poolInfo}
          campaign={poolState.campaign}
          documentHash={documentHash}
          networkType={getSolanaNetworkType(poolInfo.chainId)}
          handleClose={handleCloseFlow}
        />
      )}
      {step === WIDGET_STEP.ApproveLender && (
        <ApproveLender
          poolInfo={poolInfo}
          isUniTranche={!!isUniTranche}
          documentHash={documentHash}
          changeTranche={setSelectedTranche}
        />
      )}
      {step === WIDGET_STEP.ChooseTranche && (
        <ChooseTranche
          poolUnderlyingToken={poolInfo.underlyingMint}
          selectedTranche={selectedTranche}
          changeTranche={setSelectedTranche}
        />
      )}
      {step === WIDGET_STEP.ChooseAmount && (
        <ChooseAmount
          poolInfo={poolInfo}
          poolState={poolState}
          tokenAccount={tokenAccount}
          selectedTranche={selectedTranche}
          isUniTranche={isUniTranche}
        />
      )}
      {step === WIDGET_STEP.ApproveAllowance && (
        <ApproveAllowance poolState={poolState} />
      )}
      {step === WIDGET_STEP.Transfer && selectedTranche && (
        <Transfer
          poolInfo={poolInfo}
          poolState={poolState}
          selectedTranche={selectedTranche}
          networkType={getSolanaNetworkType(poolInfo.chainId)}
        />
      )}
      {step === WIDGET_STEP.Done && (
        <Success
          poolInfo={poolInfo}
          poolState={poolState}
          campaign={poolState.campaign}
          handleAction={handleCloseFlow}
        />
      )}
      {step === WIDGET_STEP.PointsEarned && (
        <PointsEarned lpConfig={poolState} handleAction={handleCloseFlow} />
      )}
      {step === WIDGET_STEP.Error && (
        <SolanaErrorModal
          chainId={poolInfo.chainId}
          title='Supply'
          errorReason='Sorry there was an error'
          errorMessage={errorMessage}
          handleOk={handleCloseFlow}
        />
      )}
    </WidgetWrapper>
  )
}
