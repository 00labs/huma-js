import { formatMoney, SolanaPoolInfo, timeUtil } from '@huma-finance/shared'
import { SolanaPoolState } from '@huma-finance/web-shared'
import React from 'react'

import dayjs from 'dayjs'
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
    const lockupEndTime = dayjs()
      .add(poolState.withdrawalLockupPeriodDays ?? 0, 'day')
      .date(1)
    const withdrawTime = lockupEndTime.add(1, 'month')
    return [
      `You can begin submitting redemption requests on ${timeUtil.timestampToLL(
        lockupEndTime.unix(),
      )}, which can be redeemed starting ${timeUtil.timestampToLL(
        withdrawTime.unix(),
      )}.`,
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
