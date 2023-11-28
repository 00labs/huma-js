import { formatMoney, UnderlyingTokenInfo } from '@huma-finance/shared'
import React from 'react'

import { REDEMPTION_TYPE, RedemptionActionInfo } from '.'
import { useAppSelector } from '../../../hooks/useRedux'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { TxDoneModal } from '../../TxDoneModal'

type Props = {
  poolUnderlyingToken: UnderlyingTokenInfo
  redemptionType: REDEMPTION_TYPE
  handleAction: () => void
}

export function Done({
  poolUnderlyingToken,
  redemptionType,
  handleAction,
}: Props): React.ReactElement {
  const { symbol } = poolUnderlyingToken
  const { redeemAmount, redeemShares } = useAppSelector(selectWidgetState)
  const redemptionActionInfo = RedemptionActionInfo[redemptionType]

  const content = [
    `You successfully ${redemptionActionInfo.action.toLowerCase()}ed ${formatMoney(
      redeemAmount,
    )} ${symbol} (${redeemShares} shares) redemption request.`,
    `Note: Exact redemption amounts may vary once processed.`,
  ]

  return <TxDoneModal handleAction={handleAction} content={content} />
}
