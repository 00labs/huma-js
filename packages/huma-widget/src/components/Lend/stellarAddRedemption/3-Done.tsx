import { formatNumber, StellarPoolInfo } from '@huma-finance/shared'
import React, { useCallback } from 'react'
import { useAppSelector } from '../../../hooks/useRedux'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { StellarTxDoneModal } from '../../StellarTxDoneModal'

type Props = {
  poolInfo: StellarPoolInfo
  handleAction: (options?: { isSuccess?: boolean }) => void
}

export function Done({ poolInfo, handleAction }: Props): React.ReactElement {
  const { redeemAmount, txHash } = useAppSelector(selectWidgetState)
  const { symbol } = poolInfo.underlyingToken

  const content = [
    `${formatNumber(redeemAmount ?? 0)} ${symbol} requested for withdrawal`,
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
