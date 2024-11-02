import {
  CloseModalOptions,
  SolanaPoolInfo,
  timeUtil,
} from '@huma-finance/shared'
import { SolanaPoolState } from '@huma-finance/web-shared'
import dayjs from 'dayjs'
import React from 'react'
import { useAppSelector } from '../../../hooks/useRedux'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { SolanaTxDoneModal } from '../../SolanaTxDoneModal'

type Props = {
  poolInfo: SolanaPoolInfo
  poolState: SolanaPoolState
  handleAction: (options?: CloseModalOptions) => void
}

export function Success({
  poolInfo,
  poolState,
  handleAction,
}: Props): React.ReactElement {
  const { solanaSignature } = useAppSelector(selectWidgetState)

  const lockupEndTime = dayjs()
    .add(poolState.withdrawalLockupPeriodDays ?? 0, 'day')
    .date(1)
  const withdrawTime = lockupEndTime.add(1, 'month')
  const content = [
    `Redemption request will be automatically submitted on ${timeUtil.timestampToLL(
      lockupEndTime.unix(),
    )}. Your deposit can be redeemed and yield rewards will stop on ${timeUtil.timestampToLL(
      withdrawTime.unix(),
    )}.`,
  ]

  return (
    <SolanaTxDoneModal
      handleAction={handleAction}
      content={content}
      chainId={poolInfo.chainId}
      solanaSignature={solanaSignature}
      buttonText='DONE'
    />
  )
}
