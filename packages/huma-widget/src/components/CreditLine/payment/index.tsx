import { useWeb3React } from '@web3-react/core'
import {
  POOL_NAME,
  POOL_TYPE,
  useAccountStats,
  usePoolInfo,
} from '@huma-finance/shared'
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
 * Credit line pool payment props
 * @typedef {Object} CreditLinePaymentProps
 * @property {POOL_NAME} poolName The name of the pool.
 * @property {POOL_TYPE} poolType The type of the pool.
 * @property {function():void} handleClose Function to notify to close the widget modal when user clicks the 'x' close button.
 * @property {function((number|undefined)):void|undefined} handleSuccess Optional function to notify that the credit line pool payment action is successful.
 */
export type CreditLinePaymentProps = {
  poolName: keyof typeof POOL_NAME
  poolType: keyof typeof POOL_TYPE
  handleClose: () => void
  handleSuccess?: (blockNumber?: number) => void
}

export function CreditLinePayment({
  poolName: poolNameStr,
  poolType: poolTypeStr,
  handleClose,
  handleSuccess,
}: CreditLinePaymentProps): React.ReactElement | null {
  const dispatch = useDispatch()
  const { account, chainId, provider } = useWeb3React()
  const poolName = POOL_NAME[poolNameStr]
  const poolType = POOL_TYPE[poolTypeStr]
  const poolInfo = usePoolInfo(poolName, poolType, chainId)
  const { step, errorMessage } = useAppSelector(selectWidgetState)
  const [{ creditRecord, payoffAmount, totalDueAmount }] = useAccountStats(
    poolName,
    poolType,
    chainId,
    account,
    provider,
  )

  useEffect(() => {
    dispatch(setStep(WIDGET_STEP.ChooseAmount))
  }, [dispatch])

  if (!poolInfo) {
    return null
  }

  return (
    <WidgetWrapper
      isOpen
      isLoading={!creditRecord}
      loadingTitle='Make Payment'
      handleClose={handleClose}
      handleSuccess={handleSuccess}
    >
      {step === WIDGET_STEP.ChooseAmount && (
        <ChooseAmount
          poolInfo={poolInfo}
          payoffAmount={payoffAmount}
          totalDueAmount={totalDueAmount}
        />
      )}
      {step === WIDGET_STEP.ApproveAllowance && (
        <ApproveAllowance poolInfo={poolInfo} />
      )}
      {step === WIDGET_STEP.Transfer && <Transfer poolInfo={poolInfo} />}
      {step === WIDGET_STEP.Done && (
        <Success poolInfo={poolInfo} handleAction={handleClose} />
      )}
      {step === WIDGET_STEP.Error && (
        <ErrorModal
          title='Make Payment'
          errorMessage={errorMessage}
          handleOk={handleClose}
        />
      )}
    </WidgetWrapper>
  )
}
