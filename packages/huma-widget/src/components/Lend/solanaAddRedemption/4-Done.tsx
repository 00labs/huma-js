import { formatNumber, SolanaPoolInfo } from '@huma-finance/shared'
import React from 'react'

import { useAppSelector } from '../../../hooks/useRedux'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { SolanaTxDoneModal } from '../../SolanaTxDoneModal'

type Props = {
  poolInfo: SolanaPoolInfo
  handleAction: () => void
}

export function Done({ poolInfo, handleAction }: Props): React.ReactElement {
  const { redeemShares, solanaSignature } = useAppSelector(selectWidgetState)

  const content = [
    `${formatNumber(redeemShares)} shares requested for redemption`,
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
