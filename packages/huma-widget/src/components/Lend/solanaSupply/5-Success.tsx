import { formatMoney, SolanaPoolInfo, timeUtil } from '@huma-finance/shared'
import { SolanaPoolState } from '@huma-finance/web-shared'
import moment from 'moment'
import React from 'react'

import { selectWidgetState } from '../../../store/widgets.selectors'
import { useAppSelector } from '../../../hooks/useRedux'
import { SolanaTxDoneModal } from '../../SolanaTxDoneModal'

type Props = {
  poolInfo: SolanaPoolInfo
  poolState: SolanaPoolState
  handleAction: () => void
}

export function Success({
  poolInfo,
  poolState,
  handleAction,
}: Props): React.ReactElement {
  const { supplyAmount, solanaSignature } = useAppSelector(selectWidgetState)
  const { symbol } = poolInfo.underlyingMint

  const content = [
    `You successfully supplied ${formatMoney(supplyAmount)} ${symbol}.`,
  ]

  const getSubContent = () => {
    const currentTime = moment().add(
      poolState.withdrawalLockoutPeriodDays,
      'days',
    )
    return [
      `First redemption date: ${timeUtil.timestampToLL(
        currentTime.unix(),
      )}. You can redeem end of each month after.`,
    ]
  }

  return (
    <SolanaTxDoneModal
      handleAction={handleAction}
      content={content}
      subContent={getSubContent()}
      chainId={poolInfo.chainId}
      solanaSignature={solanaSignature}
      buttonText='DONE'
    />
  )
}
