import { BN } from '@coral-xyz/anchor'
import {
  formatMoneyFixed,
  SolanaTokenUtils,
  UnderlyingTokenInfo,
} from '@huma-finance/shared'
import React from 'react'
import { TxDoneModal } from '../../TxDoneModal'

type Props = {
  poolUnderlyingToken: UnderlyingTokenInfo
  withdrawAmount: BN
  handleAction: () => void
}

export function Done({
  poolUnderlyingToken,
  withdrawAmount,
  handleAction,
}: Props): React.ReactElement {
  const { symbol } = poolUnderlyingToken
  const withdrawAmountFormatted = formatMoneyFixed(
    SolanaTokenUtils.formatUnits(withdrawAmount, poolUnderlyingToken.decimals),
    2,
  )

  const content = [
    `You successfully withdrew ${withdrawAmountFormatted} ${symbol}.`,
  ]

  return <TxDoneModal handleAction={handleAction} content={content} />
}
