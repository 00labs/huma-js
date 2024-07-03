import {
  POOL_NAME,
  TrancheType,
  openInNewTab,
  useLPConfigV2,
  useLenderApprovedV2,
  usePoolInfoV2,
  usePoolUnderlyingTokenInfoV2,
} from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ErrorModal } from '../../ErrorModal'
import { WidgetWrapper } from '../../WidgetWrapper'
import { ChooseTranche } from './1-ChooseTranche'
import { Evaluation } from './2-Evaluation'
import { ChooseAmount } from './3-ChooseAmount'
import { ApproveAllowance } from './4-ApproveAllowance'
import { Transfer } from './5-Transfer'
import { Success } from './6-Success'
import { Notifications } from './7-Notifications'

/**
 * Lend pool supply props
 * @typedef {Object} LendSupplyPropsV2
 * @property {POOL_NAME} poolName The name of the pool.
 * @property {boolean} shouldApproveAll To check if should approve both tranches.
 * @property {function():void} handleClose Function to notify to close the widget modal when user clicks the 'x' close button.
 * @property {function((number|undefined)):void|undefined} handleSuccess Optional function to notify that the lending pool supply action is successful.
 */
export interface LendSupplyPropsV2 {
  poolName: keyof typeof POOL_NAME
  shouldApproveAll?: boolean
  handleClose: () => void
  handleSuccess?: (blockNumber?: number) => void
}

export function LendSupplyV2({
  poolName: poolNameStr,
  shouldApproveAll,
  handleClose,
  handleSuccess,
}: LendSupplyPropsV2): React.ReactElement | null {
  const dispatch = useDispatch()
  const poolName = POOL_NAME[poolNameStr]
  const { chainId, provider, account } = useWeb3React()
  const poolInfo = usePoolInfoV2(poolName, chainId)
  const { step, errorMessage } = useAppSelector(selectWidgetState)
  const [selectedTranche, setSelectedTranche] = useState<TrancheType>()
  const poolUnderlyingToken = usePoolUnderlyingTokenInfoV2(poolName, provider)
  const lpConfig = useLPConfigV2(poolName, provider)
  const isUniTranche = lpConfig?.maxSeniorJuniorRatio === 0
  const [lenderApprovedSenior] = useLenderApprovedV2(
    poolName,
    'senior',
    account,
    provider,
  )
  const [lenderApprovedJunior] = useLenderApprovedV2(
    poolName,
    'junior',
    account,
    provider,
  )

  const lenderApproveStatusFetched =
    lenderApprovedSenior !== undefined && lenderApprovedJunior !== undefined

  useEffect(() => {
    if (!step && poolInfo && lenderApproveStatusFetched && lpConfig) {
      if (
        shouldApproveAll &&
        !isUniTranche &&
        (!lenderApprovedJunior || !lenderApprovedSenior)
      ) {
        if (poolInfo.KYC) {
          dispatch(setStep(WIDGET_STEP.Evaluation))
        } else if (poolInfo.supplyLink) {
          openInNewTab(poolInfo.supplyLink)
          handleClose()
        }
        return
      }

      if (lenderApprovedJunior && !lenderApprovedSenior) {
        setSelectedTranche('junior')
        dispatch(setStep(WIDGET_STEP.ChooseAmount))
        return
      }

      if (lenderApprovedSenior && !lenderApprovedJunior) {
        setSelectedTranche('senior')
        dispatch(setStep(WIDGET_STEP.ChooseAmount))
        return
      }

      if (lenderApprovedJunior && lenderApprovedSenior) {
        dispatch(setStep(WIDGET_STEP.ChooseTranche))
        return
      }

      if (poolInfo.KYC) {
        dispatch(setStep(WIDGET_STEP.Evaluation))
        return
      }

      if (poolInfo.supplyLink) {
        openInNewTab(poolInfo.supplyLink)
        handleClose()
      }
    }
  }, [
    dispatch,
    handleClose,
    isUniTranche,
    lenderApproveStatusFetched,
    lenderApprovedJunior,
    lenderApprovedSenior,
    lpConfig,
    poolInfo,
    shouldApproveAll,
    step,
  ])

  if (
    !poolInfo ||
    !poolUnderlyingToken ||
    !lenderApproveStatusFetched ||
    !lpConfig
  ) {
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
      loadingTitle={`Supply ${poolUnderlyingToken.symbol}`}
      handleClose={handleClose}
      handleSuccess={handleSuccess}
    >
      {step === WIDGET_STEP.ChooseTranche && (
        <ChooseTranche
          poolUnderlyingToken={poolUnderlyingToken}
          selectedTranche={selectedTranche}
          changeTranche={setSelectedTranche}
        />
      )}
      {step === WIDGET_STEP.Evaluation && (
        <Evaluation
          poolInfo={poolInfo}
          handleClose={handleClose}
          isUniTranche={isUniTranche}
          changeTranche={setSelectedTranche}
        />
      )}
      {step === WIDGET_STEP.ChooseAmount && (
        <ChooseAmount
          poolInfo={poolInfo}
          poolUnderlyingToken={poolUnderlyingToken}
          selectedTranche={selectedTranche}
          isUniTranche={isUniTranche}
        />
      )}
      {step === WIDGET_STEP.ApproveAllowance && (
        <ApproveAllowance
          poolInfo={poolInfo}
          poolUnderlyingToken={poolUnderlyingToken}
        />
      )}
      {step === WIDGET_STEP.Transfer && selectedTranche && (
        <Transfer
          poolInfo={poolInfo}
          poolUnderlyingToken={poolUnderlyingToken}
          trancheType={selectedTranche}
        />
      )}
      {step === WIDGET_STEP.Done && (
        <Success
          poolInfo={poolInfo}
          poolUnderlyingToken={poolUnderlyingToken}
          handleAction={handleClose}
        />
      )}
      {step === WIDGET_STEP.Notifications && (
        <Notifications handleAction={handleClose} />
      )}
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
