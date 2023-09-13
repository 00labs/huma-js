import {
  POOL_NAME,
  POOL_TYPE,
  useAccountStats,
  usePoolInfoV2,
} from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import { BigNumberish } from 'ethers'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ErrorModal } from '../../ErrorModal'
import { WidgetWrapper } from '../../WidgetWrapper'
import { ApproveAllowance } from './1-ApproveAllowance'
import { Success } from './2-Success'

/**
 * Credit line pool approve allowance props
 * @typedef {Object} CreditLineApproveProps
 * @property {POOL_NAME} poolName The name of the pool.
 * @property {POOL_TYPE} poolType The type of the pool.
 * @property {BigNumberish|undefined} amount The amount to approve.
 * @property {function():void} handleClose Function to notify to close the widget modal when user clicks the 'x' close button.
 * @property {function((number|undefined)):void|undefined} handleSuccess Optional function to notify that the credit line pool approve allowance action is successful.
 */
export type CreditLineApproveProps = {
  poolName: keyof typeof POOL_NAME
  poolType: keyof typeof POOL_TYPE
  amount?: BigNumberish
  handleClose: () => void
  handleSuccess?: (blockNumber?: number) => void
}

export function CreditLineApprove({
  poolName: poolNameStr,
  poolType: poolTypeStr,
  amount,
  handleClose,
  handleSuccess,
}: CreditLineApproveProps): React.ReactElement | null {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const poolName = POOL_NAME[poolNameStr]
  const poolType = POOL_TYPE[poolTypeStr]
  const poolInfo = usePoolInfoV2(poolName, poolType)
  const { step, errorMessage } = useAppSelector(selectWidgetState)
  const [accountStats] = useAccountStats(poolName, poolType, account)
  const { creditRecord } = accountStats

  useEffect(() => {
    dispatch(setStep(WIDGET_STEP.ApproveAllowance))
  }, [dispatch])

  if (!poolInfo) {
    return null
  }

  return (
    <WidgetWrapper
      isOpen
      isLoading={!creditRecord}
      loadingTitle='Approve Allowance'
      handleClose={handleClose}
      handleSuccess={handleSuccess}
    >
      {step === WIDGET_STEP.ApproveAllowance && (
        <ApproveAllowance poolInfo={poolInfo} amount={amount} />
      )}
      {step === WIDGET_STEP.Done && (
        <Success poolInfo={poolInfo} handleAction={handleClose} />
      )}
      {step === WIDGET_STEP.Error && (
        <ErrorModal
          title='Approve Allowance'
          errorMessage={errorMessage}
          handleOk={handleClose}
        />
      )}
    </WidgetWrapper>
  )
}
