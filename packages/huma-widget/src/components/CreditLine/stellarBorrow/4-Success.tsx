import {
  CloseModalOptions,
  formatNumber,
  StellarPoolInfo,
  timeUtil,
} from '@huma-finance/shared'
import React, { useCallback } from 'react'
import { StellarPoolState } from '@huma-finance/web-shared'
import { useAppSelector } from '../../../hooks/useRedux'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { StellarTxDoneModal } from '../../StellarTxDoneModal'

type Props = {
  poolInfo: StellarPoolInfo
  poolState: StellarPoolState
  handleAction: (options?: CloseModalOptions) => void
}

export function Success({
  poolInfo,
  poolState,
  handleAction,
}: Props): React.ReactElement {
  const { supplyAmount, txHash } = useAppSelector(selectWidgetState)
  const { symbol } = poolInfo.underlyingToken
  const dueDate = timeUtil.timestampToLL(poolState.epochEndTime)

  const content = [
    `${formatNumber(supplyAmount)} ${symbol} is now in your wallet.`,
    `Note: your payment will be automatically deducted on ${dueDate}.`,
  ]

  const handleUserAction = useCallback(() => {
    handleAction({ isSuccess: true })
  }, [handleAction])

  return (
    <StellarTxDoneModal
      chainId={poolInfo.chainId}
      handleAction={handleUserAction}
      content={content}
      txHash={txHash}
      buttonText='DONE'
    />
  )
}
