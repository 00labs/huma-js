import {
  POOL_NAME,
  TrancheType,
  UnderlyingTokenInfo,
  usePoolInfoV2,
} from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { useAppSelector } from '../../../hooks/useRedux'
import { usePoolUnderlyingTokenInfo } from '../../../hooks/usePoolUnderlyingTokenInfo'
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
import { LoadingModal } from '../../LoadingModal'

/**
 * Lend pool supply props
 * @typedef {Object} LendSupplyPropsV2
 * @property {POOL_NAME} poolName The name of the pool.
 * @property {poolUnderlyingToken|undefined} poolUnderlyingToken The pool's underlying token info.
 * @property {function():void} handleClose Function to notify to close the widget modal when user clicks the 'x' close button.
 * @property {function((number|undefined)):void|undefined} handleSuccess Optional function to notify that the lending pool supply action is successful.
 */
export interface LendSupplyPropsV2 {
  poolName: keyof typeof POOL_NAME
  poolUnderlyingToken?: UnderlyingTokenInfo
  handleClose: () => void
  handleSuccess?: (blockNumber?: number) => void
}

export function LendSupplyV2({
  poolName: poolNameStr,
  poolUnderlyingToken: defaultPoolUnderlyingToken,
  handleClose,
  handleSuccess,
}: LendSupplyPropsV2): React.ReactElement | null {
  const dispatch = useDispatch()
  const { chainId } = useWeb3React()
  const poolName = POOL_NAME[poolNameStr]
  const poolInfo = usePoolInfoV2(poolName, chainId)
  const { step, errorMessage } = useAppSelector(selectWidgetState)
  const [selectedTranche, setSelectedTranche] = useState<TrancheType>()
  const poolUnderlyingToken = usePoolUnderlyingTokenInfo(
    poolName,
    defaultPoolUnderlyingToken,
  )

  useEffect(() => {
    if (!step) {
      dispatch(setStep(WIDGET_STEP.ChooseTranche))
    }
  }, [dispatch, step])

  if (!poolInfo || !poolUnderlyingToken) {
    return <LoadingModal title='Supply' />
  }

  return (
    <WidgetWrapper
      isOpen
      loadingTitle={`Supply ${poolUnderlyingToken.symbol}`}
      handleClose={handleClose}
      handleSuccess={handleSuccess}
    >
      {step === WIDGET_STEP.ChooseTranche && (
        <ChooseTranche
          poolInfo={poolInfo}
          poolUnderlyingToken={poolUnderlyingToken}
          selectedTranche={selectedTranche}
          changeTranche={setSelectedTranche}
        />
      )}
      {step === WIDGET_STEP.Evaluation && (
        <Evaluation poolInfo={poolInfo} handleClose={handleClose} />
      )}
      {step === WIDGET_STEP.ChooseAmount && (
        <ChooseAmount
          poolInfo={poolInfo}
          poolUnderlyingToken={poolUnderlyingToken}
          selectedTranche={selectedTranche}
        />
      )}
      {step === WIDGET_STEP.ApproveAllowance && (
        <ApproveAllowance
          poolInfo={poolInfo}
          poolUnderlyingToken={poolUnderlyingToken}
        />
      )}
      {step === WIDGET_STEP.Transfer && selectedTranche && (
        <Transfer
          poolInfo={poolInfo}
          poolUnderlyingToken={poolUnderlyingToken}
          trancheType={selectedTranche}
        />
      )}
      {step === WIDGET_STEP.Done && (
        <Success
          poolInfo={poolInfo}
          poolUnderlyingToken={poolUnderlyingToken}
          handleAction={handleClose}
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
