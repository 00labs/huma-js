import { useWeb3React } from '@web3-react/core'
import { CreditState, POOL_NAME, POOL_TYPE } from '@huma-finance/core'
import { useAccountStats, usePoolInfo } from '@huma-finance/web-core'
import React, { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'

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
import {
  useDoesChainSupportNotifi,
  useIsFirstTimeNotifiUser,
} from '../../../hooks/useNotifi'

/**
 * Credit line pool borrow props
 * @typedef {Object} CreditLineBorrowProps
 * @property {POOL_NAME} poolName The name of the pool.
 * @property {POOL_TYPE} poolType The type of the pool.
 * @property {function():void} handleClose Function to notify to close the widget modal when user clicks the 'x' close button.
 * @property {function():void|undefined} handleApprove Optional function to notify when user is approved successfully to borrow again pool.
 * @property {function((number|undefined)):void|undefined} handleSuccess Optional function to notify that the credit line pool borrow action is successful.
 */
export interface CreditLineBorrowProps {
  poolName: keyof typeof POOL_NAME
  poolType: keyof typeof POOL_TYPE
  handleClose: () => void
  handleApprove?: () => void
  handleSuccess?: (blockNumber?: number) => void
}

export function CreditLineBorrow({
  poolName: poolNameStr,
  poolType: poolTypeStr,
  handleClose,
  handleApprove,
  handleSuccess,
}: CreditLineBorrowProps): React.ReactElement | null {
  const dispatch = useDispatch()
  const { account, chainId, provider } = useWeb3React()
  const poolName = POOL_NAME[poolNameStr]
  const poolType = POOL_TYPE[poolTypeStr]
  const poolInfo = usePoolInfo(poolName, poolType, chainId)
  const { step, errorMessage } = useAppSelector(selectWidgetState)
  const [accountStats, refreshAccountStats] = useAccountStats(
    poolName,
    poolType,
    chainId,
    account,
    provider,
  )
  const { isFirstTimeNotifiUser } = useIsFirstTimeNotifiUser(account, chainId)
  const { notifiChainSupported } = useDoesChainSupportNotifi(chainId)
  const { creditRecord } = accountStats
  const accountState = creditRecord?.state

  useEffect(() => {
    if (!step && accountState !== undefined) {
      const nextStep =
        accountState >= CreditState.Approved
          ? WIDGET_STEP.ChooseAmount
          : WIDGET_STEP.Evaluation
      dispatch(setStep(nextStep))
    }
  }, [accountState, dispatch, step])

  const approveCallback = useCallback(() => {
    if (handleApprove) {
      handleApprove()
    }
    refreshAccountStats()
  }, [handleApprove, refreshAccountStats])

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
      isLoading={!creditRecord}
      loadingTitle='Borrow'
      handleClose={handleClose}
      handleSuccess={handleSuccess}
    >
      {step === WIDGET_STEP.Evaluation && (
        <Evaluation poolInfo={poolInfo} handleApprove={approveCallback} />
      )}
      {step === WIDGET_STEP.ChooseAmount && (
        <ChooseAmount poolInfo={poolInfo} accountStats={accountStats} />
      )}
      {step === WIDGET_STEP.ApproveAllowance && (
        <ApproveAllowance poolInfo={poolInfo} />
      )}
      {step === WIDGET_STEP.Transfer && <Transfer poolInfo={poolInfo} />}
      {step === WIDGET_STEP.Done && (
        <Success
          poolInfo={poolInfo}
          handleAction={setupNotificationsOrClose}
          creditRecord={creditRecord!}
          hasNextStep={isFirstTimeNotifiUser}
        />
      )}
      {step === WIDGET_STEP.Notifications && (
        <Notifications handleAction={handleClose} />
      )}
      {step === WIDGET_STEP.Error && (
        <ErrorModal
          title='Borrow'
          errorMessage={errorMessage}
          handleOk={handleClose}
        />
      )}
    </WidgetWrapper>
  )
}
