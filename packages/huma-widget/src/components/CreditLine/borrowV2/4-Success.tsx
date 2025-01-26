import {
  CreditStatsV2,
  formatNumber,
  timeUtil,
  UnderlyingTokenInfo,
} from '@huma-finance/shared'
import React from 'react'

import { useAppSelector } from '../../../hooks/useRedux'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { TxDoneModal } from '../../TxDoneModal'

type Props = {
  poolUnderlyingToken: UnderlyingTokenInfo
  creditRecord: CreditStatsV2['creditRecord']
  handleAction: () => void
  hasNextStep: boolean
}

export function Success({
  poolUnderlyingToken,
  creditRecord,
  handleAction,
  hasNextStep,
}: Props): React.ReactElement {
  const { borrowAmountNet } = useAppSelector(selectWidgetState)
  const { symbol } = poolUnderlyingToken
  const dueDate = timeUtil.timestampToLL(creditRecord?.nextDueDate.toNumber())

  const content = [
    `${formatNumber(borrowAmountNet)} ${symbol} is now in your wallet.`,
    `Note: your payment will be automatically deducted on ${dueDate}.`,
  ]

  return (
    <TxDoneModal
      handleAction={handleAction}
      content={content}
      buttonText={hasNextStep ? "WHAT'S NEXT" : undefined}
    />
  )
}
