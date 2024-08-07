import { POOL_NAME, TrancheType } from '@huma-finance/core'
import {
  useCancellableRedemptionInfoV2,
  usePoolInfoV2,
  usePoolUnderlyingTokenInfoV2,
} from '@huma-finance/web-core'
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from 'ethers'
import React, { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ErrorModal } from '../../ErrorModal'
import { WidgetWrapper } from '../../WidgetWrapper'
import { Transfer } from './1-Transfer'
import { Done } from './2-Done'

export type RedemptionInfo = {
  shares: BigNumber
  amount: BigNumber
}

/**
 * Lend pool cancel redemption request props
 * @typedef {Object} CancelRedemptionPropsV2
 * @property {POOL_NAME} poolName The name of the pool.
 * @property {TrancheType} trancheType The type of the tranche.
 * @property {function():void} handleClose Function to notify to close the widget modal when user clicks the 'x' close button.
 * @property {function((number|undefined)):void|undefined} handleSuccess Optional function to notify that the lending pool withdraw action is successful.
 */
export type CancelRedemptionPropsV2 = {
  poolName: keyof typeof POOL_NAME
  trancheType: TrancheType
  handleClose: () => void
  handleSuccess?: (blockNumber?: number) => void
}

export function CancelRedemptionV2({
  poolName: poolNameStr,
  trancheType,
  handleClose,
  handleSuccess,
}: CancelRedemptionPropsV2): React.ReactElement | null {
  const title = 'Cancel redemption'
  const dispatch = useDispatch()
  const { account, chainId, provider } = useWeb3React()
  const poolName = POOL_NAME[poolNameStr]
  const poolInfo = usePoolInfoV2(poolName, chainId)
  const { step, errorMessage, errorReason } = useAppSelector(selectWidgetState)
  const poolUnderlyingToken = usePoolUnderlyingTokenInfoV2(poolName, provider)
  const [redemptionInfo] = useCancellableRedemptionInfoV2(
    poolName,
    trancheType,
    account,
    provider,
  )

  useEffect(() => {
    if (!step) {
      dispatch(setStep(WIDGET_STEP.Transfer))
    }
  }, [dispatch, step])

  const handleRedeemSuccess = useCallback(
    (blockNumber: number) => {
      if (handleSuccess) {
        handleSuccess(blockNumber)
      }
    },
    [handleSuccess],
  )

  if (!poolInfo || !poolUnderlyingToken || !redemptionInfo) {
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
      handleSuccess={handleRedeemSuccess}
    >
      {step === WIDGET_STEP.Transfer && (
        <Transfer
          poolInfo={poolInfo}
          trancheType={trancheType}
          redemptionInfo={redemptionInfo}
        />
      )}
      {step === WIDGET_STEP.Done && (
        <Done
          poolUnderlyingToken={poolUnderlyingToken}
          handleAction={handleClose}
          redemptionInfo={redemptionInfo}
        />
      )}
      {step === WIDGET_STEP.Error && (
        <ErrorModal
          title={title}
          errorReason={errorReason}
          errorMessage={errorMessage}
          handleOk={handleClose}
        />
      )}
    </WidgetWrapper>
  )
}
