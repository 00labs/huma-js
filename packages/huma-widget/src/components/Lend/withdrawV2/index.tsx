import {
  POOL_NAME,
  TrancheType,
  usePoolInfoV2,
  usePoolUnderlyingTokenInfoV2,
  useTrancheWithdrawableAssetsV2,
} from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { BigNumber } from 'ethers'
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
 * @property {function():void} handleClose Function to notify to close the widget modal when user clicks the 'x' close button.
 * @property {function((number|undefined)):void|undefined} handleSuccess Optional function to notify that the lending pool withdraw action is successful.
 */
export type LendWithdrawPropsV2 = {
  poolName: keyof typeof POOL_NAME
  handleClose: () => void
  handleSuccess?: (blockNumber?: number) => void
}

export function LendWithdrawV2({
  poolName: poolNameStr,
  handleClose,
  handleSuccess,
}: LendWithdrawPropsV2): React.ReactElement | null {
  const dispatch = useDispatch()
  const { account, chainId, provider } = useWeb3React()
  const poolName = POOL_NAME[poolNameStr]
  const poolInfo = usePoolInfoV2(poolName, chainId)
  const { step, errorMessage } = useAppSelector(selectWidgetState)
  const [seniorWithdrawableAmount, refreshSeniorWithdrawableAmount] =
    useTrancheWithdrawableAssetsV2(poolName, 'senior', account, provider)
  const [juniorWithdrawableAmount, refreshJuniorWithdrawableAmount] =
    useTrancheWithdrawableAssetsV2(poolName, 'junior', account, provider)
  const poolUnderlyingToken = usePoolUnderlyingTokenInfoV2(poolName, provider)
  const [selectedTranche, setSelectedTranche] = useState<TrancheType>()
  const [withdrawAmount, setWithdrawAmount] = useState<BigNumber>()

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

  const handleChangeTranche = useCallback(
    (tranche: TrancheType) => {
      setSelectedTranche(tranche)
      if (tranche === 'senior') {
        setWithdrawAmount(seniorWithdrawableAmount)
      }
      if (tranche === 'junior') {
        setWithdrawAmount(juniorWithdrawableAmount)
      }
    },
    [juniorWithdrawableAmount, seniorWithdrawableAmount],
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
          changeTranche={handleChangeTranche}
          seniorWithdrawableAmount={seniorWithdrawableAmount}
          juniorWithdrawableAmount={juniorWithdrawableAmount}
        />
      )}
      {step === WIDGET_STEP.Transfer && selectedTranche && (
        <Transfer poolInfo={poolInfo} selectedTranche={selectedTranche} />
      )}
      {step === WIDGET_STEP.Done && withdrawAmount && (
        <Done
          poolUnderlyingToken={poolUnderlyingToken}
          withdrawAmount={withdrawAmount}
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
