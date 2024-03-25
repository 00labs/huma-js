import { useWeb3React } from '@web3-react/core'
import {
  POOL_NAME,
  POOL_TYPE,
  useLenderPosition,
  usePoolBalance,
  usePoolInfo,
} from '@huma-finance/shared'
import React, { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ErrorModal } from '../../ErrorModal'
import { WidgetWrapper } from '../../WidgetWrapper'
import { CheckWithdrawable } from './1-CheckWithdrawble'
import { ChooseAmount } from './2-ChooseAmount'
import { Transfer } from './3-Transfer'
import { Success } from './4-Success'

/**
 * Lend pool withdraw props
 * @typedef {Object} LendWithdrawProps
 * @property {POOL_NAME} poolName The name of the pool.
 * @property {POOL_TYPE} poolType The type of the pool.
 * @property {function():void} handleClose Function to notify to close the widget modal when user clicks the 'x' close button.
 * @property {function((number|undefined)):void|undefined} handleSuccess Optional function to notify that the lending pool withdraw action is successful.
 */
export type LendWithdrawProps = {
  poolName: keyof typeof POOL_NAME
  poolType: keyof typeof POOL_TYPE
  handleClose: () => void
  handleSuccess?: (blockNumber?: number) => void
}

export function LendWithdraw({
  poolName: poolNameStr,
  poolType: poolTypeStr,
  handleClose,
  handleSuccess,
}: LendWithdrawProps): React.ReactElement | null {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const poolName = POOL_NAME[poolNameStr]
  const poolType = POOL_TYPE[poolTypeStr]
  const poolInfo = usePoolInfo(poolName, poolType)
  const { step, errorMessage } = useAppSelector(selectWidgetState)
  const [lenderPosition, refreshLenderPosition] = useLenderPosition(
    poolName,
    poolType,
    account,
  )
  const [poolBalance, refreshPoolBalance] = usePoolBalance(poolName, poolType)

  useEffect(() => {
    if (!step && lenderPosition && poolBalance) {
      dispatch(setStep(WIDGET_STEP.CheckWithdrawable))
    }
  }, [dispatch, lenderPosition, poolBalance, step])

  const handleWithdrawSuccess = useCallback(
    (blockNumber: number) => {
      refreshLenderPosition()
      refreshPoolBalance()
      if (handleSuccess) {
        handleSuccess(blockNumber)
      }
    },
    [handleSuccess, refreshLenderPosition, refreshPoolBalance],
  )

  if (!poolInfo) {
    return null
  }

  return (
    <WidgetWrapper
      isOpen
      handleClose={handleClose}
      handleSuccess={handleWithdrawSuccess}
    >
      {(!step || step === WIDGET_STEP.CheckWithdrawable) && (
        <CheckWithdrawable poolInfo={poolInfo} handleClose={handleClose} />
      )}
      {step === WIDGET_STEP.ChooseAmount && lenderPosition && poolBalance && (
        <ChooseAmount
          poolInfo={poolInfo}
          lenderPosition={lenderPosition}
          poolBalance={poolBalance}
        />
      )}
      {step === WIDGET_STEP.Transfer && <Transfer poolInfo={poolInfo} />}
      {step === WIDGET_STEP.Done && (
        <Success poolInfo={poolInfo} handleAction={handleClose} />
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
