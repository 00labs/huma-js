import { POOL_NAME, TrancheType, usePoolInfoV2 } from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ErrorModal } from '../../ErrorModal'
import { WidgetWrapper } from '../../WidgetWrapper'
import { ChooseTranche } from './1-ChooseTranche'
import { Evaluation } from './2-Evaluation'
import { ChooseAmount } from './3-ChooseAmount'
import { ApproveAllowance } from './4-ApproveAllowance'
import { Transfer } from './5-Transfer'
import { Success } from './6-Success'
import { Notifications } from './7-Notifications'

/**
 * Lend pool supply props
 * @typedef {Object} LendSupplyPropsV2
 * @property {POOL_NAME} poolName The name of the pool.
 * @property {function():void} handleClose Function to notify to close the widget modal when user clicks the 'x' close button.
 * @property {function((number|undefined)):void|undefined} handleSuccess Optional function to notify that the lending pool supply action is successful.
 */
export interface LendSupplyPropsV2 {
  poolName: keyof typeof POOL_NAME
  handleClose: () => void
  handleSuccess?: (blockNumber?: number) => void
}

export function LendSupplyV2({
  poolName: poolNameStr,
  handleClose,
  handleSuccess,
}: LendSupplyPropsV2): React.ReactElement | null {
  const dispatch = useDispatch()
  const { chainId } = useWeb3React()
  const poolName = POOL_NAME[poolNameStr]
  const poolInfo = usePoolInfoV2(poolName, chainId)
  const { step, errorMessage } = useAppSelector(selectWidgetState)
  const [selectedTranche, setSelectedTranche] = useState<TrancheType>()

  useEffect(() => {
    if (!step) {
      dispatch(setStep(WIDGET_STEP.ChooseTranche))
    }
  }, [dispatch, step])

  if (!poolInfo) {
    return null
  }

  return (
    <WidgetWrapper
      isOpen
      loadingTitle={`Supply ${poolInfo.poolUnderlyingToken.symbol}`}
      handleClose={handleClose}
      handleSuccess={handleSuccess}
    >
      {step === WIDGET_STEP.ChooseTranche && (
        <ChooseTranche
          poolInfo={poolInfo}
          selectedTranche={selectedTranche}
          changeTranche={setSelectedTranche}
        />
      )}
      {step === WIDGET_STEP.Evaluation && (
        <Evaluation poolInfo={poolInfo} handleClose={handleClose} />
      )}
      {step === WIDGET_STEP.ChooseAmount && (
        <ChooseAmount poolInfo={poolInfo} selectedTranche={selectedTranche} />
      )}
      {step === WIDGET_STEP.ApproveAllowance && (
        <ApproveAllowance poolInfo={poolInfo} />
      )}
      {step === WIDGET_STEP.Transfer && selectedTranche && (
        <Transfer poolInfo={poolInfo} trancheType={selectedTranche} />
      )}
      {step === WIDGET_STEP.Done && (
        <Success poolInfo={poolInfo} handleAction={handleClose} />
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
