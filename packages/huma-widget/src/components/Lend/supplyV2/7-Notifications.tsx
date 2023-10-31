import React from 'react'
import { NotifiSubscriptionModal } from '../../Notifi/NotifiSubscriptionModal'

type Props = {
  handleAction: () => void
}

export function Notifications({ handleAction }: Props): React.ReactElement {
  return <NotifiSubscriptionModal handleSuccess={handleAction} />
}
