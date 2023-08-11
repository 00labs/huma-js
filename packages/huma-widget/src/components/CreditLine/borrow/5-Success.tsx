import { CreditRecordType, PoolInfoType, timeUtil } from '@huma-finance/shared'
import React from 'react'

import { useAppSelector } from '../../../hooks/useRedux'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { TxDoneModal } from '../../TxDoneModal'

type Props = {
  poolInfo: PoolInfoType
  creditRecord: CreditRecordType
  handleAction: () => void
  hasNextStep: boolean
}

export function Success({
  poolInfo,
  creditRecord,
  handleAction,
  hasNextStep,
}: Props): React.ReactElement {
  const { borrowAmountNet } = useAppSelector(selectWidgetState)
  const { poolUnderlyingToken } = poolInfo
  const { symbol } = poolUnderlyingToken
  const dueDate = timeUtil.timestampToLL(creditRecord?.dueDate.toNumber())

  const content = [
    `${borrowAmountNet} ${symbol} is now in your wallet.`,
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
