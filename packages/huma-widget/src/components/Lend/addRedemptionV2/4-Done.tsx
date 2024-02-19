import { formatNumber } from '@huma-finance/shared'
import React from 'react'

import { useAppSelector } from '../../../hooks/useRedux'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { TxDoneModal } from '../../TxDoneModal'

type Props = {
  handleAction: () => void
}

export function Done({ handleAction }: Props): React.ReactElement {
  const { redeemShares } = useAppSelector(selectWidgetState)

  const content = [
    `${formatNumber(redeemShares)} shares requested for redemption`,
  ]

  return <TxDoneModal handleAction={handleAction} content={content} />
}
