import {
  POOL_NAME,
  useCancellableRedemptionInfoV2,
  useLenderPositionV2,
  usePoolInfoV2,
  usePoolUnderlyingTokenInfoV2,
} from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from 'ethers'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ErrorModal } from '../../ErrorModal'
import { WidgetWrapper } from '../../WidgetWrapper'
import { ChooseAction } from './1-ChooseAction'
import { ChooseAmount } from './2-ChooseAmount'
import { Transfer } from './3-Transfer'
import { Done } from './4-Done'

/**
 * Lend pool withdraw props
 * @typedef {Object} LendRedeemPropsV2
 * @property {POOL_NAME} poolName The name of the pool.
 * @property {function():void} handleClose Function to notify to close the widget modal when user clicks the 'x' close button.
 * @property {function((number|undefined)):void|undefined} handleSuccess Optional function to notify that the lending pool withdraw action is successful.
 */
export type LendRedeemPropsV2 = {
  poolName: keyof typeof POOL_NAME
  handleClose: () => void
  handleSuccess?: (blockNumber?: number) => void
}

export enum REDEMPTION_TYPE {
  AddSeniorRedemption = 1,
  CancelSeniorRedemption = 2,
  AddJuniorRedemption = 3,
  CancelJuniorRedemption = 4,
}

export const RedemptionActionInfo: {
  [key in REDEMPTION_TYPE]: {
    action: 'Add' | 'Cancel'
    tranche: 'senior' | 'junior'
  }
} = {
  [REDEMPTION_TYPE.AddSeniorRedemption]: {
    action: 'Add',
    tranche: 'senior',
  },
  [REDEMPTION_TYPE.CancelSeniorRedemption]: {
    action: 'Cancel',
    tranche: 'senior',
  },
  [REDEMPTION_TYPE.AddJuniorRedemption]: {
    action: 'Add',
    tranche: 'junior',
  },
  [REDEMPTION_TYPE.CancelJuniorRedemption]: {
    action: 'Cancel',
    tranche: 'junior',
  },
}

export type RedemptionInfo = {
  shares: BigNumber
  amount: BigNumber
}

export function LendRedeemV2({
  poolName: poolNameStr,
  handleClose,
  handleSuccess,
}: LendRedeemPropsV2): React.ReactElement | null {
  const dispatch = useDispatch()
  const { account, chainId, provider } = useWeb3React()
  const poolName = POOL_NAME[poolNameStr]
  const poolInfo = usePoolInfoV2(poolName, chainId)
  const { step, errorMessage } = useAppSelector(selectWidgetState)
  const [seniorRedemptionInfo, refreshSeniorRedemptionInfo] =
    useCancellableRedemptionInfoV2(poolName, 'senior', account, provider)
  const [juniorRedemptionInfo, refreshJuniorRedemptionInfo] =
    useCancellableRedemptionInfoV2(poolName, 'junior', account, provider)
  const poolUnderlyingToken = usePoolUnderlyingTokenInfoV2(poolName, provider)
  const [seniorPosition, refreshSeniorPosition] = useLenderPositionV2(
    poolName,
    'senior',
    account,
    provider,
  )
  const [juniorPosition, refreshJuniorPosition] = useLenderPositionV2(
    poolName,
    'junior',
    account,
    provider,
  )
  const [redemptionType, setRedemptionType] = useState<REDEMPTION_TYPE>()
  const redemptionActionInfo = redemptionType
    ? RedemptionActionInfo[redemptionType]
    : undefined

  useEffect(() => {
    if (!step) {
      dispatch(setStep(WIDGET_STEP.ChooseTranche))
    }
  }, [dispatch, step])

  const handleRedeemSuccess = useCallback(
    (blockNumber: number) => {
      refreshSeniorRedemptionInfo()
      refreshJuniorRedemptionInfo()
      refreshSeniorPosition()
      refreshJuniorPosition()
      if (handleSuccess) {
        handleSuccess(blockNumber)
      }
    },
    [
      handleSuccess,
      refreshJuniorPosition,
      refreshJuniorRedemptionInfo,
      refreshSeniorPosition,
      refreshSeniorRedemptionInfo,
    ],
  )

  const getMaxAmount = () => {
    if (redemptionActionInfo?.tranche === 'senior') {
      return redemptionActionInfo?.action === 'Add'
        ? seniorPosition
        : seniorRedemptionInfo?.amount
    }
    if (redemptionActionInfo?.tranche === 'junior') {
      return redemptionActionInfo?.action === 'Add'
        ? juniorPosition
        : juniorRedemptionInfo?.amount
    }
    return undefined
  }

  if (!poolInfo || !poolUnderlyingToken) {
    return (
      <WidgetWrapper
        isOpen
        isLoading
        loadingTitle='Redeem'
        handleClose={handleClose}
        handleSuccess={handleSuccess}
      />
    )
  }

  return (
    <WidgetWrapper
      isOpen
      loadingTitle='Redeem'
      handleClose={handleClose}
      handleSuccess={handleRedeemSuccess}
    >
      {step === WIDGET_STEP.ChooseTranche && (
        <ChooseAction
          poolUnderlyingToken={poolUnderlyingToken}
          seniorRedemptionInfo={seniorRedemptionInfo}
          juniorRedemptionInfo={juniorRedemptionInfo}
          redemptionType={redemptionType}
          changeRedemptionType={setRedemptionType}
        />
      )}
      {step === WIDGET_STEP.ChooseAmount && redemptionType && (
        <ChooseAmount
          poolInfo={poolInfo}
          poolUnderlyingToken={poolUnderlyingToken}
          redemptionType={redemptionType}
          maxAmount={getMaxAmount() ?? BigNumber.from(0)}
        />
      )}
      {step === WIDGET_STEP.Transfer && redemptionType && (
        <Transfer
          poolInfo={poolInfo}
          poolUnderlyingToken={poolUnderlyingToken}
          redemptionType={redemptionType}
        />
      )}
      {step === WIDGET_STEP.Done && redemptionType && (
        <Done
          poolUnderlyingToken={poolUnderlyingToken}
          handleAction={handleClose}
          redemptionType={redemptionType}
        />
      )}
      {step === WIDGET_STEP.Error && (
        <ErrorModal
          title='Withdraw'
          errorReason='Sorry there was an error'
          errorMessage={errorMessage}
          handleOk={handleClose}
        />
      )}
    </WidgetWrapper>
  )
}
