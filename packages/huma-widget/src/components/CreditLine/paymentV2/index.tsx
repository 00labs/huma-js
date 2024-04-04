import {
  POOL_NAME,
  useCreditStatsV2,
  usePoolInfoV2,
  usePoolUnderlyingTokenInfoV2,
} from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ErrorModal } from '../../ErrorModal'
import { WidgetWrapper } from '../../WidgetWrapper'
import { ChooseAmount } from './1-ChooseAmount'
import { ApproveAllowance } from './2-ApproveAllowance'
import { Transfer } from './3-Transfer'
import { Success } from './4-Success'

/**
 * Credit line pool payment props V2
 * @typedef {Object} CreditLinePaymentPropsV2
 * @property {POOL_NAME} poolName The name of the pool.
 * @property {function():void} handleClose Function to notify to close the widget modal when user clicks the 'x' close button.
 * @property {function((number|undefined)):void|undefined} handleSuccess Optional function to notify that the credit line pool payment action is successful.
 */
export type CreditLinePaymentPropsV2 = {
  poolName: keyof typeof POOL_NAME
  handleClose: () => void
  handleSuccess?: (blockNumber?: number) => void
}

export function CreditLinePaymentV2({
  poolName: poolNameStr,
  handleClose,
  handleSuccess,
}: CreditLinePaymentPropsV2): React.ReactElement | null {
  const dispatch = useDispatch()
  const { account, chainId, provider } = useWeb3React()
  const poolName = POOL_NAME[poolNameStr]
  const poolInfo = usePoolInfoV2(poolName, chainId)
  const { step, errorMessage } = useAppSelector(selectWidgetState)
  const [{ creditRecord, totalDueAmount, payoffAmount }] = useCreditStatsV2(
    poolName,
    account,
    provider,
  )
  const poolUnderlyingToken = usePoolUnderlyingTokenInfoV2(poolName, provider)

  useEffect(() => {
    dispatch(setStep(WIDGET_STEP.ChooseAmount))
  }, [dispatch])

  if (!poolInfo || !creditRecord || !poolUnderlyingToken) {
    return (
      <WidgetWrapper
        isOpen
        isLoading
        loadingTitle='Pay'
        handleClose={handleClose}
        handleSuccess={handleSuccess}
      />
    )
  }

  return (
    <WidgetWrapper
      isOpen
      isLoading={!creditRecord}
      loadingTitle='Pay'
      handleClose={handleClose}
      handleSuccess={handleSuccess}
    >
      {step === WIDGET_STEP.ChooseAmount && (
        <ChooseAmount
          poolInfo={poolInfo}
          poolUnderlyingToken={poolUnderlyingToken}
          payoffAmount={payoffAmount!}
          totalDueAmount={totalDueAmount!}
        />
      )}
      {step === WIDGET_STEP.ApproveAllowance && (
        <ApproveAllowance
          poolInfo={poolInfo}
          poolUnderlyingToken={poolUnderlyingToken}
        />
      )}
      {step === WIDGET_STEP.Transfer && (
        <Transfer
          poolInfo={poolInfo}
          poolUnderlyingToken={poolUnderlyingToken}
        />
      )}
      {step === WIDGET_STEP.Done && (
        <Success
          poolUnderlyingToken={poolUnderlyingToken}
          handleAction={handleClose}
        />
      )}
      {step === WIDGET_STEP.Error && (
        <ErrorModal
          title='Pay'
          errorMessage={errorMessage}
          handleOk={handleClose}
        />
      )}
    </WidgetWrapper>
  )
}
