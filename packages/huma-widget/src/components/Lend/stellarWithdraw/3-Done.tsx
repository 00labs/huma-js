import { formatNumber, StellarPoolInfo } from '@huma-finance/shared'
import React, { useCallback } from 'react'
import { useAppSelector } from '../../../hooks/useRedux'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { StellarTxDoneModal } from '../../StellarTxDoneModal'

type Props = {
  poolInfo: StellarPoolInfo
  withdrawAmount?: number
  handleAction: (options?: { isSuccess?: boolean }) => void
}

export function Done({
  poolInfo,
  withdrawAmount,
  handleAction,
}: Props): React.ReactElement {
  const { txHash } = useAppSelector(selectWidgetState)
  const { symbol } = poolInfo.underlyingToken

  const content = [
    `${formatNumber(withdrawAmount ?? 0)} ${symbol} withdrawn to your wallet`,
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
