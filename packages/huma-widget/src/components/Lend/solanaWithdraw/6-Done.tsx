import { BN } from '@coral-xyz/anchor'
import {
  configUtil,
  formatMoneyFixed,
  SolanaTokenUtils,
  UnderlyingTokenInfo,
} from '@huma-finance/shared'
import { Link } from '@mui/material'
import React from 'react'
import { ClaimAndStakeOption, WithdrawOption } from '.'
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
    option.id === WithdrawOption.WITHDRAW_AND_REDEPOSIT ? (
      <>
        You have withdrawn {withdrawAmountFormatted} {symbol} and redeposited to
        Huma Permissionless.{' '}
        <Link
          href={configUtil.dappLink}
          target='_blank'
          rel='noopener noreferrer'
        >
          Go to Huma Permissionless
        </Link>{' '}
        to view your deposit.
      </>
    ) : (
      `You successfully withdrew ${withdrawAmountFormatted} ${symbol}.`
    ),
  ]

  return <TxDoneModal handleAction={handleAction} content={content} />
}
