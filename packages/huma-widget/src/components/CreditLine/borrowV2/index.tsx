import { CreditStateV2, POOL_NAME } from '@huma-shan/core'
import {
  useCreditStatsV2,
  usePoolInfoV2,
  usePoolUnderlyingTokenInfoV2,
} from '@huma-shan/web-core'
import { useWeb3React } from '@web3-react/core'
import React, { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import {
  useDoesChainSupportNotifi,
  useIsFirstTimeNotifiUser,
} from '../../../hooks/useNotifi'
import { useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ErrorModal } from '../../ErrorModal'
import { LoadingModal } from '../../LoadingModal'
import { WidgetWrapper } from '../../WidgetWrapper'
import { ChooseAmount } from './1-ChooseAmount'
import { ApproveAllowance } from './2-ApproveAllowance'
import { Transfer } from './3-Transfer'
import { Success } from './4-Success'
import { Notifications } from './5-Notifications'

/**
 * Credit line pool borrow props V2
 * @typedef {Object} CreditLineBorrowPropsV2
 * @property {POOL_NAME} poolName The name of the pool.
 * @property {function():void} handleClose Function to notify to close the widget modal when user clicks the 'x' close button.
 * @property {function((number|undefined)):void|undefined} handleSuccess Optional function to notify that the credit line pool borrow action is successful.
 */
export interface CreditLineBorrowPropsV2 {
  poolName: keyof typeof POOL_NAME
  handleClose: () => void
  handleSuccess?: (blockNumber?: number) => void
}

export function CreditLineBorrowV2({
  poolName: poolNameStr,
  handleClose,
  handleSuccess,
}: CreditLineBorrowPropsV2): React.ReactElement | null {
  const dispatch = useDispatch()
  const poolName = POOL_NAME[poolNameStr]
  const { account, chainId, provider } = useWeb3React()
  const poolInfo = usePoolInfoV2(poolName, chainId)
  const poolUnderlyingToken = usePoolUnderlyingTokenInfoV2(poolName, provider)
  const { step, errorMessage } = useAppSelector(selectWidgetState)
  const [accountStats, refreshAccountStats] = useCreditStatsV2(
    poolName,
    account,
    provider,
  )
  const { isFirstTimeNotifiUser } = useIsFirstTimeNotifiUser(account, chainId)
  const { notifiChainSupported } = useDoesChainSupportNotifi(chainId)
  const { creditRecord } = accountStats
  const accountState = creditRecord?.state

  useEffect(() => {
    if (!step && accountState !== undefined) {
      if (accountState >= CreditStateV2.Approved) {
        dispatch(setStep(WIDGET_STEP.ChooseAmount))
      }
    }
  }, [accountState, dispatch, step])

  const setupNotificationsOrClose = useCallback(() => {
    if (isFirstTimeNotifiUser && notifiChainSupported) {
      dispatch(setStep(WIDGET_STEP.Notifications))
    } else {
      handleClose()
    }
  }, [dispatch, handleClose, isFirstTimeNotifiUser, notifiChainSupported])

  const handleSuccessCallback = useCallback(() => {
    refreshAccountStats()
    if (handleSuccess) {
      handleSuccess()
    }
  }, [handleSuccess, refreshAccountStats])

  if (!poolInfo || !poolUnderlyingToken || !creditRecord) {
    return (
      <WidgetWrapper
        isOpen
        isLoading
        loadingTitle='Borrow'
        handleClose={handleClose}
        handleSuccess={handleSuccessCallback}
      />
    )
  }

  return (
    <WidgetWrapper
      isOpen
      loadingTitle='Borrow'
      handleClose={handleClose}
      handleSuccess={handleSuccessCallback}
    >
      {!step && <LoadingModal title='Borrow' />}
      {step === WIDGET_STEP.ChooseAmount && (
        <ChooseAmount
          poolInfo={poolInfo}
          poolUnderlyingToken={poolUnderlyingToken}
          accountStats={accountStats}
        />
      )}
      {step === WIDGET_STEP.ApproveAllowance && (
        <ApproveAllowance
          poolInfo={poolInfo}
          poolUnderlyingToken={poolUnderlyingToken}
        />
      )}
      {step === WIDGET_STEP.Transfer && <Transfer poolInfo={poolInfo} />}
      {step === WIDGET_STEP.Done && (
        <Success
          poolUnderlyingToken={poolUnderlyingToken}
          handleAction={setupNotificationsOrClose}
          creditRecord={accountStats.creditRecord!}
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
