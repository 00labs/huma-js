import {
  CloseModalOptions,
  formatMoney,
  StellarPoolInfo,
  timeUtil,
} from '@huma-finance/shared'
import React, { useCallback } from 'react'
import {
  getLenderLockupDates,
  StellarPoolState,
} from '@huma-finance/web-shared'
import { useAppSelector } from '../../../hooks/useRedux'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { StellarTxDoneModal } from '../../StellarTxDoneModal'

type Props = {
  poolInfo: StellarPoolInfo
  poolState: StellarPoolState
  handleAction: (options?: CloseModalOptions) => void
}

export function Success({
  poolInfo,
  poolState,
  handleAction,
}: Props): React.ReactElement {
  const { supplyAmount, txHash } = useAppSelector(selectWidgetState)
  const { symbol } = poolInfo.underlyingToken

  const content = [
    `You successfully supplied ${formatMoney(supplyAmount)} ${symbol}.`,
  ]

  const getSubContent = () => {
    const { lockupEndTimeUnix, withdrawTimeUnix } = getLenderLockupDates(
      poolState.withdrawalLockupPeriodDays ?? 0,
    )
    return [
      `You can begin submitting redemption requests on ${timeUtil.timestampToLL(
        lockupEndTimeUnix,
      )}, which can be redeemed starting ${timeUtil.timestampToLL(
        withdrawTimeUnix,
      )}.`,
    ]
  }

  const handleUserAction = useCallback(() => {
    handleAction({ isSuccess: true })
  }, [handleAction])

  return (
    <StellarTxDoneModal
      chainId={poolInfo.chainId}
      handleAction={handleUserAction}
      content={content}
      subContent={getSubContent()}
      txHash={txHash}
      buttonText='DONE'
    />
  )
}
