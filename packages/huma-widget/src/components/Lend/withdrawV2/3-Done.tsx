import { formatMoney, UnderlyingTokenInfo } from '@huma-finance/core'
import { BigNumber, ethers } from 'ethers'
import React from 'react'

import { TxDoneModal } from '../../TxDoneModal'

type Props = {
  poolUnderlyingToken: UnderlyingTokenInfo
  withdrawAmount: BigNumber
  handleAction: () => void
}

export function Done({
  poolUnderlyingToken,
  withdrawAmount,
  handleAction,
}: Props): React.ReactElement {
  const { symbol } = poolUnderlyingToken
  const withdrawAmountFormatted = ethers.utils.formatUnits(
    withdrawAmount,
    poolUnderlyingToken.decimals,
  )

  const content = [
    `You successfully withdrew ${formatMoney(
      withdrawAmountFormatted,
    )} ${symbol}.`,
  ]

  return <TxDoneModal handleAction={handleAction} content={content} />
}
