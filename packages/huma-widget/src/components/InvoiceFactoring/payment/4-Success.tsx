import { PoolInfoType } from '@huma-shan/core'
import React from 'react'

import { useAppSelector } from '../../../hooks/useRedux'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { TxDoneModal } from '../../TxDoneModal'

type Props = {
  poolInfo: PoolInfoType
  handleAction: () => void
}

export function Success({ poolInfo, handleAction }: Props): React.ReactElement {
  const { symbol } = poolInfo.poolUnderlyingToken
  const { paymentAmount, remainDueAmount } = useAppSelector(selectWidgetState)

  const content = [
    `You have successfully made a payment of ${paymentAmount} ${symbol}.`,
    `The remaining due amount is ${remainDueAmount} ${symbol}.`,
  ]

  return <TxDoneModal handleAction={handleAction} content={content} />
}
