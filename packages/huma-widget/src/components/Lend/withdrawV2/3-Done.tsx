import { UnderlyingTokenInfo, formatMoney } from '@huma-finance/shared'
import React from 'react'
import { TxDoneModal } from '../../TxDoneModal'
import { useAppSelector } from '../../../hooks/useRedux'
import { selectWidgetState } from '../../../store/widgets.selectors'

type Props = {
  poolUnderlyingToken: UnderlyingTokenInfo
  handleAction: () => void
}

export function Done({
  poolUnderlyingToken,
  handleAction,
}: Props): React.ReactElement {
  const { symbol } = poolUnderlyingToken
  const { withdrawAmount } = useAppSelector(selectWidgetState)

  const content = [
    `You successfully withdrew ${formatMoney(withdrawAmount)} ${symbol}.`,
  ]

  return <TxDoneModal handleAction={handleAction} content={content} />
}
