import { UnderlyingTokenInfo, formatMoney } from '@huma-finance/shared'
import { BigNumber, ethers } from 'ethers'
import React from 'react'

import { TxDoneModal } from '../../TxDoneModal'

type Props = {
  amountToDeposit: BigNumber
  poolUnderlyingToken: UnderlyingTokenInfo
  handleAction: () => void
}

export function Success({
  amountToDeposit,
  poolUnderlyingToken,
  handleAction,
}: Props): React.ReactElement {
  const { symbol, decimals } = poolUnderlyingToken
  const amountFormatted = ethers.utils.formatUnits(amountToDeposit, decimals)

  const content = [
    `You have supplied ${formatMoney(
      amountFormatted,
    )} ${symbol}, you can borrow now.`,
  ]

  return <TxDoneModal handleAction={handleAction} content={content} />
}
