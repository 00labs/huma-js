import { isEmpty } from '@huma-finance/shared'
import React, { useCallback } from 'react'

import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ConfirmTransferModal } from '../../ConfirmTransferModal'

export function ConfirmTransfer(): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { borrowAmount, approval } = useAppSelector(selectWidgetState)

  const handleAction = useCallback(() => {
    dispatch(setStep(WIDGET_STEP.ApproveAllowance))
  }, [dispatch])

  if (isEmpty(borrowAmount) || isEmpty(approval)) {
    return null
  }

  return (
    <ConfirmTransferModal
      title='Confirm transaction details'
      description={`Huma keeps your Tradable Stream NFT as collateral until it's fully paid.`}
      items={[
        { leftText: 'Tradable Stream', rightText: 'Huma' },
        {
          leftText: `${borrowAmount!.toFixed(2)} ${approval?.token.symbol}`,
          rightText: 'You',
        },
      ]}
      actionText='APPROVE TRANSFER'
      handleAction={handleAction}
    />
  )
}
