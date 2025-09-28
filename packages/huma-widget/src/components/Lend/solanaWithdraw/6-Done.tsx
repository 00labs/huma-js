import { BN } from '@coral-xyz/anchor'
import {
  formatMoneyFixed,
  SolanaTokenUtils,
  UnderlyingTokenInfo,
} from '@huma-finance/shared'
import React from 'react'
import { ClaimAndStakeOption } from '.'
import useLogOnFirstMount from '../../../hooks/useLogOnFirstMount'
import { TxDoneModal } from '../../TxDoneModal'

type Props = {
  poolUnderlyingToken: UnderlyingTokenInfo
  withdrawAmount: BN
  option: ClaimAndStakeOption
  handleAction: () => void
}

export function Done({
  poolUnderlyingToken,
  withdrawAmount,
  option,
  handleAction,
}: Props): React.ReactElement {
  useLogOnFirstMount('Success')
  const { symbol } = poolUnderlyingToken
  const withdrawAmountFormatted = formatMoneyFixed(
    SolanaTokenUtils.formatUnits(withdrawAmount, poolUnderlyingToken.decimals),
    2,
  )

  const content = [
    option.id === 'claim-and-stake'
      ? `You have withdrawn ${withdrawAmountFormatted} ${symbol} and redeposited to Permissionless.`
      : `You successfully withdrew ${withdrawAmountFormatted} ${symbol}.`,
  ]

  return <TxDoneModal handleAction={handleAction} content={content} />
}
