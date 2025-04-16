import {
  CloseModalOptions,
  formatMoney,
  SolanaPoolInfo,
  timeUtil,
} from '@huma-finance/shared'
import { SolanaPoolState } from '@huma-finance/web-shared'
import dayjs from 'dayjs'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { Campaign } from '.'
import useLogOnFirstMount from '../../../hooks/useLogOnFirstMount'
import { useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { SolanaTxDoneModal } from '../../SolanaTxDoneModal'

type Props = {
  poolInfo: SolanaPoolInfo
  poolState: SolanaPoolState
  campaign?: Campaign
  isExistingUser: boolean
  handleAction: (options?: CloseModalOptions) => void
}

export function Success({
  poolInfo,
  poolState,
  campaign,
  isExistingUser,
  handleAction,
}: Props): React.ReactElement {
  useLogOnFirstMount('Success')
  const dispatch = useDispatch()
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
      `Redemption request will be automatically submitted on ${timeUtil.timestampToLL(
        lockupEndTime.unix(),
      )}. Your deposit can be redeemed and yield rewards will stop on ${timeUtil.timestampToLL(
        withdrawTime.unix(),
      )}.`,
    ]
  }

  const handleUserAction = useCallback(() => {
    if (campaign && !isExistingUser) {
      dispatch(setStep(WIDGET_STEP.PointsEarned))
    } else {
      handleAction({ isSuccess: true })
    }
  }, [campaign, dispatch, handleAction, isExistingUser])

  return (
    <SolanaTxDoneModal
      handleAction={handleUserAction}
      content={content}
      subContent={getSubContent()}
      chainId={poolInfo.chainId}
      solanaSignature={solanaSignature}
      buttonText={campaign && !isExistingUser ? 'VIEW FEATHERS' : 'DONE'}
    />
  )
}
