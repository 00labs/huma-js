import {
  FirstLossCoverIndex,
  POOL_NAME,
  capitalizeFirstLetter,
  formatBNFixed,
  useCancellableRedemptionInfoV2,
  useFirstLossCoverStatsV2,
  useLenderPositionV2,
  usePoolInfoV2,
  usePoolIsReadyForFlcWithdrawalV2,
  usePoolUnderlyingTokenInfoV2,
  useTrancheWithdrawableAssetsV2,
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
// import { ChooseAmount } from './2-ChooseAmount'
// import { Transfer } from './3-Transfer'
// import { Done } from './4-Done'

export type ActionType = {
  label: string
  value: string
  action: 'redemption' | 'cancelRedemption' | 'withdraw'
  type: 'senior' | 'junior' | 'firstLossCover'
  availableAmount: BigNumber
}

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

export function LendRedeemV2({
  poolName: poolNameStr,
  handleClose,
  handleSuccess,
}: LendRedeemPropsV2): React.ReactElement | null {
  const dispatch = useDispatch()
  const { account, chainId, provider } = useWeb3React()
  const poolName = POOL_NAME[poolNameStr]
  const poolInfo = usePoolInfoV2(poolName, chainId)
  const { step, errorMessage, errorReason } = useAppSelector(selectWidgetState)
  const poolUnderlyingToken = usePoolUnderlyingTokenInfoV2(poolName, provider)
  const { symbol, decimals } = poolUnderlyingToken || {}
  const [actionTypes, setActionTypes] = useState<ActionType[]>([])
  const [selectedActionType, setSelectedActionType] = useState<ActionType>()
  const [seniorPosition] = useLenderPositionV2(
    poolName,
    'senior',
    account,
    provider,
  )
  const [juniorPosition] = useLenderPositionV2(
    poolName,
    'junior',
    account,
    provider,
  )
  const [seniorRedemptionInfo] = useCancellableRedemptionInfoV2(
    poolName,
    'senior',
    account,
    provider,
  )
  const [juniorRedemptionInfo] = useCancellableRedemptionInfoV2(
    poolName,
    'junior',
    account,
    provider,
  )
  const [seniorWithdrawableAmount] = useTrancheWithdrawableAssetsV2(
    poolName,
    'senior',
    account,
    provider,
  )
  const [juniorWithdrawableAmount] = useTrancheWithdrawableAssetsV2(
    poolName,
    'junior',
    account,
    provider,
  )
  const isReadyForFlcWithdrawal = usePoolIsReadyForFlcWithdrawalV2(
    poolName,
    provider,
  )
  const [flcStats] = useFirstLossCoverStatsV2(poolName, account, provider)

  const isLoading =
    !poolInfo ||
    !poolUnderlyingToken ||
    !seniorRedemptionInfo ||
    !juniorRedemptionInfo ||
    !juniorRedemptionInfo ||
    !seniorPosition ||
    !juniorPosition ||
    isReadyForFlcWithdrawal === undefined ||
    !seniorWithdrawableAmount ||
    !juniorWithdrawableAmount ||
    !flcStats

  useEffect(() => {
    if (!step && !isLoading) {
      const items: ActionType[] = []
      if (seniorPosition.gt(0)) {
        items.push({
          label: `Redeem ${formatBNFixed(
            seniorPosition,
            decimals!,
          )} ${symbol} from Senior Tranche`,
          value: 'seniorRedemption',
          action: 'redemption',
          type: 'senior',
          availableAmount: seniorPosition,
        })
      }
      if (seniorRedemptionInfo.amount.gt(0)) {
        items.push({
          label: `Cancel ${formatBNFixed(
            seniorRedemptionInfo.amount,
            decimals!,
          )} ${symbol} Senior Tranche Redemption`,
          value: 'cancelSeniorRedemption',
          action: 'cancelRedemption',
          type: 'senior',
          availableAmount: seniorRedemptionInfo.amount,
        })
      }
      if (juniorPosition.gt(0)) {
        items.push({
          label: `Redeem ${formatBNFixed(
            juniorPosition,
            decimals!,
          )} ${symbol} from Junior Tranche`,
          value: 'juniorRedemption',
          action: 'redemption',
          type: 'junior',
          availableAmount: juniorPosition,
        })
      }
      if (juniorRedemptionInfo.amount.gt(0)) {
        items.push({
          label: `Cancel ${formatBNFixed(
            juniorRedemptionInfo.amount,
            decimals!,
          )} ${symbol} Junior Tranche Redemption`,
          value: 'cancelJuniorRedemption',
          action: 'cancelRedemption',
          type: 'junior',
          availableAmount: juniorRedemptionInfo.amount,
        })
      }
      if (seniorWithdrawableAmount.gt(0)) {
        items.push({
          label: `Withdraw ${formatBNFixed(
            seniorWithdrawableAmount,
            decimals!,
          )} ${symbol} from Senior Tranche`,
          value: 'seniorWithdraw',
          action: 'withdraw',
          type: 'senior',
          availableAmount: seniorWithdrawableAmount,
        })
      }
      if (juniorWithdrawableAmount.gt(0)) {
        items.push({
          label: `Withdraw ${formatBNFixed(
            juniorWithdrawableAmount,
            decimals!,
          )} ${symbol} from Junior Tranche`,
          value: 'juniorWithdraw',
          action: 'withdraw',
          type: 'junior',
          availableAmount: juniorWithdrawableAmount,
        })
      }
      if (isReadyForFlcWithdrawal) {
        flcStats
          .filter((flc) => flc.totalAssets.gt(0))
          .forEach((flc) => {
            items.push({
              label: `Withdraw ${symbol} from ${capitalizeFirstLetter(
                FirstLossCoverIndex[flc.firstLossCoverIndex],
              )} First Loss Cover`,
              value: String(flc.firstLossCoverIndex),
              action: 'withdraw',
              type: 'firstLossCover',
              availableAmount: flc.totalAssets,
            })
          })
      }

      setActionTypes(items)
      if (items.length === 1) {
        setSelectedActionType(items[0])
        const step =
          items[0].type === 'firstLossCover'
            ? WIDGET_STEP.ChooseAmount
            : WIDGET_STEP.Transfer
        dispatch(setStep(step))
      } else if (items.length > 1) {
        dispatch(setStep(WIDGET_STEP.ChooseTranche))
      }
    }
  }, [
    decimals,
    dispatch,
    flcStats,
    isLoading,
    isReadyForFlcWithdrawal,
    juniorPosition,
    juniorRedemptionInfo?.amount,
    juniorWithdrawableAmount,
    seniorPosition,
    seniorRedemptionInfo?.amount,
    seniorWithdrawableAmount,
    step,
    symbol,
  ])

  const handleRedeemSuccess = useCallback(
    (blockNumber: number) => {
      if (handleSuccess) {
        handleSuccess(blockNumber)
      }
    },
    [handleSuccess],
  )

  if (isLoading) {
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
          poolInfo={poolInfo}
          poolUnderlyingToken={poolUnderlyingToken}
          selectedActionType={selectedActionType}
          actionTypes={actionTypes}
          changeActionType={setSelectedActionType}
        />
      )}
      {/* {step === WIDGET_STEP.ChooseAmount && redemptionType && (
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
      )} */}
      {step === WIDGET_STEP.Error && (
        <ErrorModal
          title='Redeem'
          errorReason={errorReason}
          errorMessage={errorMessage}
          handleOk={handleClose}
        />
      )}
    </WidgetWrapper>
  )
}
