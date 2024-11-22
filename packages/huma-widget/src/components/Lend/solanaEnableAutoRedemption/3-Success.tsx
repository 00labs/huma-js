import {
  CloseModalOptions,
  SolanaPoolInfo,
  timeUtil,
} from '@huma-finance/shared'
import { getLenderLockupDates, SolanaPoolState } from '@huma-finance/web-shared'
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

  const { lockupEndTimeUnix, withdrawTimeUnix } = getLenderLockupDates(
    poolState.withdrawalLockupPeriodDays ?? 0,
  )
  const content = [
    `Redemption request will be automatically submitted on ${timeUtil.timestampToLL(
      lockupEndTimeUnix,
    )}. Your deposit can be redeemed and yield rewards will stop on ${timeUtil.timestampToLL(
      withdrawTimeUnix,
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
