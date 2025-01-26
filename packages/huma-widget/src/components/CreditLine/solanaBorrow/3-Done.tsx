import { formatNumber, SolanaPoolInfo, timeUtil } from '@huma-finance/shared'
import React from 'react'

import { SolanaPoolState } from '@huma-finance/web-shared'
import { useAppSelector } from '../../../hooks/useRedux'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { SolanaTxDoneModal } from '../../SolanaTxDoneModal'

type Props = {
  poolInfo: SolanaPoolInfo
  poolState: SolanaPoolState
  handleAction: () => void
}

export function Done({
  poolInfo,
  poolState,
  handleAction,
}: Props): React.ReactElement {
  const { borrowAmount, solanaSignature } = useAppSelector(selectWidgetState)
  const { symbol } = poolInfo.underlyingMint
  const dueDate = timeUtil.timestampToLL(poolState.epochEndTime)

  const content = [
    `${formatNumber(borrowAmount)} ${symbol} is now in your wallet.`,
    `Note: your first automatic payment will occur after ${dueDate}.`,
  ]

  return (
    <SolanaTxDoneModal
      handleAction={handleAction}
      content={content}
      chainId={poolInfo.chainId}
      solanaSignature={solanaSignature}
      buttonText='DONE'
    />
  )
}
