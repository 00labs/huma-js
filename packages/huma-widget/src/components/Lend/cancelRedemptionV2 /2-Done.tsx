import { UnderlyingTokenInfo } from '@huma-finance/shared'
import { ethers } from 'ethers'
import React from 'react'

import { RedemptionInfo } from '.'
import { TxDoneModal } from '../../TxDoneModal'

type Props = {
  poolUnderlyingToken: UnderlyingTokenInfo
  redemptionInfo: RedemptionInfo
  handleAction: () => void
}

export function Done({
  poolUnderlyingToken,
  redemptionInfo,
  handleAction,
}: Props): React.ReactElement {
  const shares = ethers.utils.formatUnits(
    redemptionInfo.shares,
    poolUnderlyingToken.decimals,
  )

  const content = [
    `You successfully canceled ${shares} shares redemption request.`,
  ]

  return <TxDoneModal handleAction={handleAction} content={content} />
}
