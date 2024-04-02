import {
  getPoolContractV2,
  getTrancheRedemptionStatusV2,
  POOL_NAME,
  TrancheRedemptionStatus,
  TrancheType,
  usePoolInfoV2,
  usePoolUnderlyingTokenInfoV2,
} from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ErrorModal } from '../../ErrorModal'
import { WidgetWrapper } from '../../WidgetWrapper'
import { ConfirmTransfer } from './1-ConfirmTransfer'
import { Transfer } from './2-Transfer'
import { Done } from './3-Done'

/**
 * Lend pool withdraw props
 * @typedef {Object} LendWithdrawPropsV2
 * @property {POOL_NAME} poolName The name of the pool.
 * @property {TrancheType} trancheType The type of the tranche.
 * @property {function():void} handleClose Function to notify to close the widget modal when user clicks the 'x' close button.
 * @property {function((number|undefined)):void|undefined} handleSuccess Optional function to notify that the lending pool withdraw action is successful.
 */
export type LendWithdrawPropsV2 = {
  poolName: keyof typeof POOL_NAME
  trancheType: TrancheType
  handleClose: () => void
  handleSuccess?: (blockNumber?: number) => void
}

export function LendWithdrawV2({
  poolName: poolNameStr,
  trancheType,
  handleClose,
  handleSuccess,
}: LendWithdrawPropsV2): React.ReactElement | null {
  const dispatch = useDispatch()
  const { account, chainId, provider } = useWeb3React()
  const poolName = POOL_NAME[poolNameStr]
  const poolInfo = usePoolInfoV2(poolName, chainId)
  const { step, errorMessage } = useAppSelector(selectWidgetState)
  const poolUnderlyingToken = usePoolUnderlyingTokenInfoV2(poolName, provider)
  const title = poolUnderlyingToken
    ? `Withdraw ${poolUnderlyingToken.symbol}`
    : 'Withdraw'

  const [redemptionStatus, setRedemptionStatus] = React.useState<
    TrancheRedemptionStatus | undefined
  >()
  const [poolIsClosed, setPoolIsClosed] = useState<boolean | undefined>(
    undefined,
  )

  useEffect(() => {
    const fetchData = async () => {
      if (account && provider) {
        const result = await getTrancheRedemptionStatusV2(
          poolName,
          trancheType,
          account,
          provider,
        )
        setRedemptionStatus(result)
      }
    }
    fetchData()
  }, [account, poolName, provider, trancheType])

  useEffect(() => {
    const fetchData = async () => {
      if (account && provider) {
        const result = await getTrancheRedemptionStatusV2(
          poolName,
          trancheType,
          account,
          provider,
        )
        setRedemptionStatus(result)
      }
    }
    fetchData()
  }, [account, poolName, provider, trancheType])

  useEffect(() => {
    const fetchData = async () => {
      if (account && provider) {
        const poolContract = await getPoolContractV2(poolName, provider)
        if (poolContract) {
          const poolIsClosed = await poolContract.isPoolClosed()
          setPoolIsClosed(poolIsClosed)
        }
      }
    }
    fetchData()
  }, [account, poolName, provider])

  useEffect(() => {
    if (!step) {
      dispatch(setStep(WIDGET_STEP.ConfirmTransfer))
    }
  }, [dispatch, step])

  const handleWithdrawSuccess = useCallback(
    (blockNumber: number) => {
      if (handleSuccess) {
        handleSuccess(blockNumber)
      }
    },
    [handleSuccess],
  )

  if (
    !poolInfo ||
    !poolUnderlyingToken ||
    !redemptionStatus ||
    poolIsClosed === undefined
  ) {
    return (
      <WidgetWrapper
        isOpen
        isLoading
        loadingTitle={title}
        handleClose={handleClose}
        handleSuccess={handleSuccess}
      />
    )
  }

  return (
    <WidgetWrapper
      isOpen
      loadingTitle={title}
      handleClose={handleClose}
      handleSuccess={handleWithdrawSuccess}
    >
      {step === WIDGET_STEP.ConfirmTransfer && (
        <ConfirmTransfer
          poolInfo={poolInfo}
          tranche={trancheType}
          redemptionStatus={redemptionStatus}
          poolUnderlyingToken={poolUnderlyingToken}
          poolIsClosed={poolIsClosed}
        />
      )}
      {step === WIDGET_STEP.Transfer && (
        <Transfer
          poolInfo={poolInfo}
          tranche={trancheType}
          poolIsClosed={poolIsClosed}
        />
      )}
      {step === WIDGET_STEP.Done && (
        <Done
          poolUnderlyingToken={poolUnderlyingToken}
          withdrawAmount={redemptionStatus.withdrawableAssets}
          handleAction={handleClose}
        />
      )}
      {step === WIDGET_STEP.Error && (
        <ErrorModal
          title={title}
          errorReason='Sorry there was an error'
          errorMessage={errorMessage}
          handleOk={handleClose}
        />
      )}
    </WidgetWrapper>
  )
}
