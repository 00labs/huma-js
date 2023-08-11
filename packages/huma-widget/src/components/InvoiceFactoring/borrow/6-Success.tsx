import React from 'react'
import { useAppSelector } from '../../../hooks/useRedux'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { TxDoneModal } from '../../TxDoneModal'

type Props = {
  handleAction: () => void
}

export function Success({ handleAction }: Props): React.ReactElement {
  const { borrowAmountNet, remainder, approval } =
    useAppSelector(selectWidgetState)

  const content = [
    `${borrowAmountNet} ${approval?.token.symbol} is now in your wallet.`,
    `The remaining ${remainder} ${approval?.token.symbol} will be sent to your wallet when the invoice is paid.`,
  ]

  return <TxDoneModal handleAction={handleAction} content={content} />
}
