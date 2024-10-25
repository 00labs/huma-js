import {
  decodeLogs,
  downScale,
  formatMoney,
  PoolInfoV2,
  timeUtil,
  TRANSFER_ABI,
} from '@huma-finance/shared'
import { sendTxAtom } from '@huma-finance/web-shared'
import { useWeb3React } from '@web3-react/core'
import { useAtom } from 'jotai'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import dayjs from 'dayjs'
import { Campaign } from '.'
import {
  useDoesChainSupportNotifi,
  useIsFirstTimeNotifiUser,
} from '../../../hooks/useNotifi'
import { setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { TxDoneModal } from '../../TxDoneModal'

type Props = {
  poolInfo: PoolInfoV2
  lpConfig: { withdrawalLockoutPeriodInDays: number }
  campaign?: Campaign
  handleAction: () => void
}

export function Success({
  poolInfo,
  lpConfig,
  campaign,
  handleAction,
}: Props): React.ReactElement {
  const dispatch = useDispatch()
  const { account, chainId } = useWeb3React()
  const [{ txReceipt }] = useAtom(sendTxAtom)
  const { symbol, decimals, address } = poolInfo.poolUnderlyingToken
  const [supplyAmount, setSupplyAmount] = useState<string | undefined>()
  const { isFirstTimeNotifiUser } = useIsFirstTimeNotifiUser(account, chainId)
  const { notifiChainSupported } = useDoesChainSupportNotifi(chainId)
  const hasNextStep = isFirstTimeNotifiUser

  useEffect(() => {
    if (txReceipt) {
      const events = decodeLogs(txReceipt.logs, TRANSFER_ABI)
      if (events) {
        events.forEach((event) => {
          const { from, to, value } = event.args
          if (
            from.toLowerCase() === account?.toLowerCase() &&
            to.toLowerCase() === poolInfo.poolSafe.toLowerCase()
          ) {
            setSupplyAmount(downScale(value.toString(), decimals))
          }
        })
      }
    }
  }, [account, address, decimals, poolInfo.poolSafe, txReceipt])

  const handleUserAction = useCallback(() => {
    if (isFirstTimeNotifiUser && notifiChainSupported) {
      dispatch(setStep(WIDGET_STEP.Notifications))
    } else if (campaign) {
      dispatch(setStep(WIDGET_STEP.PointsEarned))
    } else {
      handleAction()
    }
  }, [
    campaign,
    dispatch,
    handleAction,
    isFirstTimeNotifiUser,
    notifiChainSupported,
  ])

  const content = [
    `You successfully supplied ${formatMoney(supplyAmount)} ${symbol}.`,
  ]

  const getSubContent = () => {
    const lockupEndTime = dayjs()
      .add(lpConfig.withdrawalLockoutPeriodInDays, 'day')
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

  const getButtonText = () => {
    if (hasNextStep) {
      return "WHAT'S NEXT"
    }
    return campaign ? 'VIEW POINTS' : undefined
  }

  return (
    <TxDoneModal
      handleAction={handleUserAction}
      content={content}
      subContent={getSubContent()}
      buttonText={getButtonText()}
    />
  )
}
