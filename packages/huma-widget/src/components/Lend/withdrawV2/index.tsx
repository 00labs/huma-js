import {
  capitalizeFirstLetter,
  FirstLossCoverIndex,
  formatBNFixed,
  POOL_NAME,
  useFirstLossCoverStatsV2,
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
import { ChooseTranche } from './1-ChooseTranche'
import { ChooseAmount } from './2-ChooseAmount'
import { Transfer } from './3-Transfer'
import { Done } from './4-Done'

export type WithdrawType = {
  label: string
  value: string
  type: 'tranche' | 'firstLossCover'
  withdrawableAmount: BigNumber
}

/**
 * Lend pool withdraw props
 * @typedef {Object} LendWithdrawPropsV2
 * @property {POOL_NAME} poolName The name of the pool.
 * @property {function():void} handleClose Function to notify to close the widget modal when user clicks the 'x' close button.
 * @property {function((number|undefined)):void|undefined} handleSuccess Optional function to notify that the lending pool withdraw action is successful.
 */
export type LendWithdrawPropsV2 = {
  poolName: keyof typeof POOL_NAME
  handleClose: () => void
  handleSuccess?: (blockNumber?: number) => void
}

export function LendWithdrawV2({
  poolName: poolNameStr,
  handleClose,
  handleSuccess,
}: LendWithdrawPropsV2): React.ReactElement | null {
  const dispatch = useDispatch()
  const { account, chainId, provider } = useWeb3React()
  const poolName = POOL_NAME[poolNameStr]
  const poolInfo = usePoolInfoV2(poolName, chainId)
  const { step, errorMessage } = useAppSelector(selectWidgetState)
  const [withdrawTypes, setWithdrawTypes] = useState<WithdrawType[]>([])
  const [selectedWithdrawType, setSelectedWithdrawType] =
    useState<WithdrawType>()

  const [seniorWithdrawableAmount, refreshSeniorWithdrawableAmount] =
    useTrancheWithdrawableAssetsV2(poolName, 'senior', account, provider)
  const [juniorWithdrawableAmount, refreshJuniorWithdrawableAmount] =
    useTrancheWithdrawableAssetsV2(poolName, 'junior', account, provider)
  const isReadyForFlcWithdrawal = usePoolIsReadyForFlcWithdrawalV2(
    poolName,
    provider,
  )
  const [flcStats, refreshFlcStats] = useFirstLossCoverStatsV2(
    poolName,
    account,
    provider,
  )

  const poolUnderlyingToken = usePoolUnderlyingTokenInfoV2(poolName, provider)
  const { symbol, decimals } = poolUnderlyingToken || {}

  const isLoading =
    !poolInfo ||
    !poolUnderlyingToken ||
    isReadyForFlcWithdrawal === undefined ||
    !seniorWithdrawableAmount ||
    !juniorWithdrawableAmount ||
    !flcStats

  useEffect(() => {
    if (!step && !isLoading) {
      const items: WithdrawType[] = []
      if (seniorWithdrawableAmount.gt(0)) {
        items.push({
          label: `Withdraw ${formatBNFixed(
            seniorWithdrawableAmount,
            decimals!,
          )} ${symbol} from Senior Tranche`,
          value: 'senior',
          type: 'tranche',
          withdrawableAmount: seniorWithdrawableAmount,
        })
      }
      if (juniorWithdrawableAmount.gt(0)) {
        items.push({
          label: `Withdraw ${formatBNFixed(
            juniorWithdrawableAmount,
            decimals!,
          )} ${symbol} from Junior Tranche`,
          value: 'junior',
          type: 'tranche',
          withdrawableAmount: juniorWithdrawableAmount,
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
              type: 'firstLossCover',
              withdrawableAmount: flc.totalAssets,
            })
          })
      }

      setWithdrawTypes(items)
      if (items.length === 1) {
        setSelectedWithdrawType(items[0])
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
    juniorWithdrawableAmount,
    seniorWithdrawableAmount,
    step,
    symbol,
  ])

  const handleWithdrawSuccess = useCallback(
    (blockNumber: number) => {
      refreshSeniorWithdrawableAmount()
      refreshJuniorWithdrawableAmount()
      refreshFlcStats()
      if (handleSuccess) {
        handleSuccess(blockNumber)
      }
    },
    [
      handleSuccess,
      refreshFlcStats,
      refreshJuniorWithdrawableAmount,
      refreshSeniorWithdrawableAmount,
    ],
  )

  if (isLoading) {
    return null
  }

  return (
    <WidgetWrapper
      isOpen
      loadingTitle='Withdraw'
      handleClose={handleClose}
      handleSuccess={handleWithdrawSuccess}
    >
      {step === WIDGET_STEP.ChooseTranche && (
        <ChooseTranche
          poolUnderlyingToken={poolUnderlyingToken}
          selectedWithdrawType={selectedWithdrawType}
          withdrawTypes={withdrawTypes}
          changeWithdrawType={setSelectedWithdrawType}
        />
      )}
      {step === WIDGET_STEP.ChooseAmount && selectedWithdrawType && (
        <ChooseAmount
          poolInfo={poolInfo}
          poolUnderlyingToken={poolUnderlyingToken}
          selectedWithdrawType={selectedWithdrawType}
        />
      )}
      {step === WIDGET_STEP.Transfer && selectedWithdrawType && (
        <Transfer
          poolInfo={poolInfo}
          poolUnderlyingToken={poolUnderlyingToken}
          selectedWithdrawType={selectedWithdrawType}
        />
      )}
      {step === WIDGET_STEP.Done && selectedWithdrawType && (
        <Done
          poolUnderlyingToken={poolUnderlyingToken}
          withdrawAmount={selectedWithdrawType.withdrawableAmount}
          handleAction={handleClose}
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
