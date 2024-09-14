import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { Campaign } from '.'
import { NotifiSubscriptionModal } from '../../Notifi/NotifiSubscriptionModal'
import { setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'

type Props = {
  campaign?: Campaign
  handleAction: () => void
}

export function Notifications({
  campaign,
  handleAction,
}: Props): React.ReactElement {
  const dispatch = useDispatch()

  const handleUserAction = useCallback(() => {
    if (campaign) {
      dispatch(setStep(WIDGET_STEP.PointsEarned))
    } else {
      handleAction()
    }
  }, [campaign, dispatch, handleAction])

  return (
    <NotifiSubscriptionModal
      successText={campaign ? 'VIEW POINTS' : undefined}
      handleSuccess={handleUserAction}
    />
  )
}
