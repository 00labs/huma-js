import { isEmpty } from '@huma-finance/core'
import React from 'react'

import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ConfirmTransferModal } from '../../ConfirmTransferModal'

export function ConfirmTransfer(): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { borrowAmountNet, approval } = useAppSelector(selectWidgetState)

  const handleAction = () => {
    dispatch(setStep(WIDGET_STEP.ApproveNFT))
  }

  if (isEmpty(borrowAmountNet) || isEmpty(approval)) {
    return null
  }

  return (
    <ConfirmTransferModal
      title='Confirm transaction details'
      description={`Huma keeps your Invoice NFT as collateral until it's fully paid.`}
      items={[
        { leftText: 'Invoice NFT', rightText: 'Huma' },
        {
          leftText: `${borrowAmountNet!} ${approval?.token.symbol}`,
          rightText: 'You',
        },
      ]}
      actionText='APPROVE TRANSFER'
      handleAction={handleAction}
    />
  )
}
