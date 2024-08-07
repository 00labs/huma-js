import {
  decodeLogs,
  downScale,
  formatMoney,
  PoolInfoV2,
  TRANSFER_ABI,
  UnderlyingTokenInfo,
} from '@huma-finance/shared'
import { sendTxAtom } from '@huma-finance/web-shared'
import { useWeb3React } from '@web3-react/core'
import { useAtom } from 'jotai'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import {
  useDoesChainSupportNotifi,
  useIsFirstTimeNotifiUser,
} from '../../../hooks/useNotifi'
import { TxDoneModal } from '../../TxDoneModal'
import { setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'

type Props = {
  poolInfo: PoolInfoV2
  poolUnderlyingToken: UnderlyingTokenInfo
  handleAction: () => void
}

export function Success({
  poolInfo,
  poolUnderlyingToken,
  handleAction,
}: Props): React.ReactElement {
  const dispatch = useDispatch()
  const { account, chainId } = useWeb3React()
  const [{ txReceipt }] = useAtom(sendTxAtom)
  const { symbol, decimals, address } = poolUnderlyingToken
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

  const setupNotificationsOrClose = useCallback(() => {
    if (isFirstTimeNotifiUser && notifiChainSupported) {
      dispatch(setStep(WIDGET_STEP.Notifications))
    } else {
      handleAction()
    }
  }, [dispatch, handleAction, isFirstTimeNotifiUser, notifiChainSupported])

  const content = [
    `You successfully supplied ${formatMoney(supplyAmount)} ${symbol}.`,
  ]

  return (
    <TxDoneModal
      handleAction={setupNotificationsOrClose}
      content={content}
      buttonText={hasNextStep ? "WHAT'S NEXT" : undefined}
    />
  )
}
