import {
  downScale,
  POOL_NAME,
  POOL_TYPE,
  useLenderApproved,
  useLenderPosition,
  usePoolAllowance,
  usePoolInfoV2,
  usePoolUnderlyingTokenBalance,
  useWithdrawlLockoutInSeconds,
} from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import React, { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import {
  useIsFirstTimeNotifiUser,
  useDoesChainSupportNotifi,
} from '../../../hooks/useNotifi'
import { useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ErrorModal } from '../../ErrorModal'
import { WidgetWrapper } from '../../WidgetWrapper'
import { Evaluation } from './1-Evaluation'
import { ChooseAmount } from './2-ChooseAmount'
import { ApproveAllowance } from './3-ApproveAllowance'
import { Transfer } from './4-Transfer'
import { Success } from './5-Success'
import { Notifications } from './6-Notifications'

/**
 * Lend pool supply props
 * @typedef {Object} LendSupplyProps
 * @property {POOL_NAME} poolName The name of the pool.
 * @property {POOL_TYPE} poolType The type of the pool.
 * @property {function():void} handleClose Function to notify to close the widget modal when user clicks the 'x' close button.
 * @property {function((number|undefined)):void|undefined} handleSuccess Optional function to notify that the lending pool supply action is successful.
 */
export interface LendSupplyProps {
  poolName: keyof typeof POOL_NAME
  poolType: keyof typeof POOL_TYPE
  handleClose: () => void
  handleSuccess?: (blockNumber?: number) => void
}

export function LendSupply({
  poolName: poolNameStr,
  poolType: poolTypeStr,
  handleClose,
  handleSuccess,
}: LendSupplyProps): React.ReactElement | null {
  const dispatch = useDispatch()
  const { account, chainId } = useWeb3React()
  const poolName = POOL_NAME[poolNameStr]
  const poolType = POOL_TYPE[poolTypeStr]
  const poolInfo = usePoolInfoV2(poolName, poolType)
  const { decimals } = poolInfo?.poolUnderlyingToken || {}
  const { step, errorMessage } = useAppSelector(selectWidgetState)
  const { allowance } = usePoolAllowance(poolName, poolType, account)
  const { isFirstTimeNotifiUser } = useIsFirstTimeNotifiUser(account, chainId)
  const { notifiChainSupported } = useDoesChainSupportNotifi(account, chainId)
  const [lenderApproved, refreshLenderApproved] = useLenderApproved(
    poolName,
    poolType,
    account,
  )
  const [, refreshLenderPosition] = useLenderPosition(
    poolName,
    poolType,
    account,
  )
  const withdrawlLockoutSeconds = useWithdrawlLockoutInSeconds(
    poolName,
    poolType,
  )
  const underlyingTokenBalance = usePoolUnderlyingTokenBalance(
    poolName,
    poolType,
    account,
  )
  const balanceWithoutDecimals = downScale(underlyingTokenBalance, decimals)

  useEffect(() => {
    if (!step && lenderApproved !== undefined) {
      const nextStep = lenderApproved
        ? WIDGET_STEP.ChooseAmount
        : WIDGET_STEP.Evaluation
      dispatch(setStep(nextStep))
    }
  }, [dispatch, lenderApproved, step])

  const handleApproveSuccess = useCallback(() => {
    refreshLenderApproved()
  }, [refreshLenderApproved])

  const handleSupplySuccess = useCallback(
    (blockNumber: number) => {
      refreshLenderPosition()
      if (handleSuccess) {
        handleSuccess(blockNumber)
      }
    },
    [handleSuccess, refreshLenderPosition],
  )

  const setupNotificationsOrClose = useCallback(() => {
    if (isFirstTimeNotifiUser && notifiChainSupported) {
      dispatch(setStep(WIDGET_STEP.Notifications))
    } else {
      handleClose()
    }
  }, [dispatch, handleClose, isFirstTimeNotifiUser, notifiChainSupported])

  if (!poolInfo) {
    return null
  }

  return (
    <WidgetWrapper
      isOpen
      isLoading={lenderApproved === undefined}
      loadingTitle={`Supply ${poolInfo.poolUnderlyingToken.symbol}`}
      handleClose={handleClose}
      handleSuccess={handleSupplySuccess}
    >
      {step === WIDGET_STEP.Evaluation && (
        <Evaluation
          poolInfo={poolInfo}
          handleClose={handleClose}
          handleApproveSuccess={handleApproveSuccess}
        />
      )}
      {step === WIDGET_STEP.ChooseAmount && (
        <ChooseAmount
          poolInfo={poolInfo}
          allowance={allowance}
          underlyingTokenBalance={balanceWithoutDecimals}
          withdrawlLockoutSeconds={withdrawlLockoutSeconds}
        />
      )}
      {step === WIDGET_STEP.ApproveAllowance && (
        <ApproveAllowance poolInfo={poolInfo} />
      )}
      {step === WIDGET_STEP.Transfer && <Transfer poolInfo={poolInfo} />}
      {step === WIDGET_STEP.Done && (
        <Success
          poolInfo={poolInfo}
          handleAction={setupNotificationsOrClose}
          hasNextStep={isFirstTimeNotifiUser}
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
