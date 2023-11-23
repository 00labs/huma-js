import {
  POOL_NAME,
  TrancheType,
  UnderlyingTokenInfo,
  usePoolInfoV2,
  useWithdrawableAssetsV2,
} from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { usePoolUnderlyingTokenInfo } from '../../../hooks/usePoolUnderlyingTokenInfo'
import { useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ErrorModal } from '../../ErrorModal'
import { WidgetWrapper } from '../../WidgetWrapper'
import { ChooseTranche } from './1-ChooseTranche'
import { Transfer } from './2-Transfer'
import { Done } from './3-Done'

/**
 * Lend pool withdraw props
 * @typedef {Object} LendWithdrawPropsV2
 * @property {POOL_NAME} poolName The name of the pool.
 * @property {UnderlyingTokenInfo} poolUnderlyingToken The underlying token of the pool
 * @property {function():void} handleClose Function to notify to close the widget modal when user clicks the 'x' close button.
 * @property {function((number|undefined)):void|undefined} handleSuccess Optional function to notify that the lending pool withdraw action is successful.
 */
export type LendWithdrawPropsV2 = {
  poolName: keyof typeof POOL_NAME
  poolUnderlyingToken?: UnderlyingTokenInfo
  handleClose: () => void
  handleSuccess?: (blockNumber?: number) => void
}

export function LendWithdrawV2({
  poolName: poolNameStr,
  poolUnderlyingToken: defaultPoolUnderlyingToken,
  handleClose,
  handleSuccess,
}: LendWithdrawPropsV2): React.ReactElement | null {
  const dispatch = useDispatch()
  const { account, chainId, provider } = useWeb3React()
  const poolName = POOL_NAME[poolNameStr]
  const poolInfo = usePoolInfoV2(poolName, chainId)
  const { step, errorMessage } = useAppSelector(selectWidgetState)
  const [seniorWithdrawableAmount, refreshSeniorWithdrawableAmount] =
    useWithdrawableAssetsV2(poolName, 'senior', account, provider)
  const [juniorWithdrawableAmount, refreshJuniorWithdrawableAmount] =
    useWithdrawableAssetsV2(poolName, 'junior', account, provider)
  const poolUnderlyingToken = usePoolUnderlyingTokenInfo(
    poolName,
    defaultPoolUnderlyingToken,
  )
  const [selectedTranche, setSelectedTranche] = useState<TrancheType>()

  useEffect(() => {
    if (!step) {
      dispatch(setStep(WIDGET_STEP.ChooseTranche))
    }
  }, [dispatch, step])

  const handleWithdrawSuccess = useCallback(
    (blockNumber: number) => {
      refreshSeniorWithdrawableAmount()
      refreshJuniorWithdrawableAmount()
      if (handleSuccess) {
        handleSuccess(blockNumber)
      }
    },
    [
      handleSuccess,
      refreshJuniorWithdrawableAmount,
      refreshSeniorWithdrawableAmount,
    ],
  )

  if (!poolInfo || !poolUnderlyingToken) {
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
          poolInfo={poolInfo}
          poolUnderlyingToken={poolUnderlyingToken}
          selectedTranche={selectedTranche}
          changeTranche={setSelectedTranche}
          seniorWithdrawableAmount={seniorWithdrawableAmount}
          juniorWithdrawableAmount={juniorWithdrawableAmount}
        />
      )}
      {step === WIDGET_STEP.Transfer && selectedTranche && (
        <Transfer poolInfo={poolInfo} selectedTranche={selectedTranche} />
      )}
      {step === WIDGET_STEP.Done && (
        <Done
          poolUnderlyingToken={poolUnderlyingToken}
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
