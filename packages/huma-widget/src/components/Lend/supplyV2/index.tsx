import {
  CloseModalOptions,
  getEvmNetworkType,
  openInNewTab,
  POOL_NAME,
  TrancheType,
} from '@huma-finance/shared'
import {
  useLenderApprovedV2,
  useLPConfigV2,
  usePoolInfoV2,
  useTrancheVaultAssetsV2,
} from '@huma-finance/web-shared'
import { useWeb3React } from '@web3-react/core'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ErrorModal } from '../../ErrorModal'
import { PointsEarned } from '../../PointsEarned'
import { WidgetWrapper } from '../../WidgetWrapper'
import { ChooseTranche } from './1-ChooseTranche'
import { Evaluation } from './2-Evaluation'
import { ApproveLender } from './3-ApproveLender'
import { ChooseAmount } from './4-ChooseAmount'
import { ApproveAllowance } from './5-ApproveAllowance'
import { Transfer } from './6-Transfer'
import { Success } from './7-Success'
import { Notifications } from './8-Notifications'

export interface Campaign {
  id: string
  campaignGroupId: string
}

/**
 * Lend pool supply props
 * @typedef {Object} LendSupplyPropsV2
 * @property {POOL_NAME} poolName The name of the pool.
 * @property {Campaign} campaign The campaign info.
 * @param {string} documentHash The subscription file hash.
 * @property {function((CloseModalOptions|undefined)):void} handleClose Function to notify to close the widget modal when user clicks the 'x' close button.
 * @property {function((number|undefined)):void|undefined} handleSuccess Optional function to notify that the lending pool supply action is successful.
 */
export interface LendSupplyPropsV2 {
  poolName: keyof typeof POOL_NAME
  campaign?: Campaign
  documentHash?: string
  handleClose: (options?: CloseModalOptions) => void
  handleSuccess?: (blockNumber?: number) => void
}

export function LendSupplyV2({
  poolName: poolNameStr,
  campaign,
  documentHash,
  handleClose,
  handleSuccess,
}: LendSupplyPropsV2): React.ReactElement | null {
  const dispatch = useDispatch()
  const poolName = POOL_NAME[poolNameStr]
  const { chainId, provider, account } = useWeb3React()
  const poolInfo = usePoolInfoV2(poolName, chainId)
  const { poolUnderlyingToken } = poolInfo || {}
  const { step, errorMessage } = useAppSelector(selectWidgetState)
  const [selectedTranche, setSelectedTranche] = useState<TrancheType>()
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
  const [juniorAssets] = useTrancheVaultAssetsV2(poolName, 'junior', provider)
  const [seniorAssets] = useTrancheVaultAssetsV2(poolName, 'senior', provider)

  const lenderApproveStatusFetched =
    lenderApprovedSenior !== undefined && lenderApprovedJunior !== undefined

  useEffect(() => {
    if (!step && poolInfo && lenderApproveStatusFetched && lpConfig) {
      const uniTrancheNotEvaluated = isUniTranche && !lenderApprovedJunior
      const tranchesNotEvaluated =
        !isUniTranche && !lenderApprovedJunior && !lenderApprovedSenior

      if (uniTrancheNotEvaluated || tranchesNotEvaluated) {
        if (poolInfo.KYC) {
          dispatch(setStep(WIDGET_STEP.Evaluation))
        } else if (poolInfo.supplyLink) {
          openInNewTab(poolInfo.supplyLink)
          handleClose()
        }
        return
      }

      if (!isUniTranche && (!lenderApprovedJunior || !lenderApprovedSenior)) {
        dispatch(setStep(WIDGET_STEP.ApproveLender))
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
    step,
  ])

  if (
    !poolInfo ||
    !poolUnderlyingToken ||
    !lenderApproveStatusFetched ||
    !lpConfig ||
    !juniorAssets ||
    !seniorAssets
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
          campaign={campaign}
          networkType={getEvmNetworkType(poolInfo.chainId)}
          documentHash={documentHash}
        />
      )}
      {step === WIDGET_STEP.ApproveLender && (
        <ApproveLender
          poolInfo={poolInfo}
          isUniTranche={isUniTranche}
          documentHash={documentHash}
          changeTranche={setSelectedTranche}
        />
      )}
      {step === WIDGET_STEP.ChooseAmount && (
        <ChooseAmount
          poolInfo={poolInfo}
          lpConfig={lpConfig}
          juniorAssets={juniorAssets}
          seniorAssets={seniorAssets}
          selectedTranche={selectedTranche}
          isUniTranche={isUniTranche}
        />
      )}
      {step === WIDGET_STEP.ApproveAllowance && (
        <ApproveAllowance poolInfo={poolInfo} />
      )}
      {step === WIDGET_STEP.Transfer && selectedTranche && (
        <Transfer
          poolInfo={poolInfo}
          trancheType={selectedTranche}
          campaign={campaign}
          networkType={getEvmNetworkType(poolInfo.chainId)}
        />
      )}
      {step === WIDGET_STEP.Done && (
        <Success
          poolInfo={poolInfo}
          lpConfig={lpConfig}
          campaign={campaign}
          handleAction={handleClose}
        />
      )}
      {step === WIDGET_STEP.Notifications && (
        <Notifications campaign={campaign} handleAction={handleClose} />
      )}
      {step === WIDGET_STEP.PointsEarned && (
        <PointsEarned
          lpConfig={{
            withdrawalLockupPeriodDays: lpConfig.withdrawalLockoutPeriodInDays,
          }}
          handleAction={handleClose}
        />
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
