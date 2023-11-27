import React from 'react'

import { TxDoneModal } from '../../TxDoneModal'

type Props = {
  handleAction: () => void
}

export function Success({ handleAction }: Props): React.ReactElement {
  const content = [`You have successfully enabled auto payback.`]

  return <TxDoneModal handleAction={handleAction} content={content} />
}
