import React from 'react'
import { useAppSelector } from '../../../hooks/useRedux'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { TxDoneModal } from '../../TxDoneModal'

type Props = {
  handleAction: () => void
}

export function Success({ handleAction }: Props): React.ReactElement {
  const { borrowAmount, approval } = useAppSelector(selectWidgetState)

  const content = [
    `${borrowAmount?.toFixed(2)} ${
      approval?.token.symbol
    } is now in your wallet.`,
  ]

  return <TxDoneModal handleAction={handleAction} content={content} />
}
