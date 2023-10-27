import {
  decodeLogs,
  downScale,
  formatMoney,
  PoolInfoV2,
  sendTxAtom,
  TRANSFER_ABI,
} from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'

import { TxDoneModal } from '../../TxDoneModal'

type Props = {
  poolInfo: PoolInfoV2
  handleAction: () => void
  hasNextStep: boolean
}

export function Success({
  poolInfo,
  handleAction,
  hasNextStep,
}: Props): React.ReactElement {
  const { account } = useWeb3React()
  const { poolUnderlyingToken } = poolInfo
  const [{ txReceipt }] = useAtom(sendTxAtom)
  const { symbol, decimals, address } = poolUnderlyingToken
  const [supplyAmount, setSupplyAmount] = useState<string | undefined>()

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

  const content = [
    `You successfully supplied ${formatMoney(supplyAmount)} ${symbol}.`,
  ]

  return (
    <TxDoneModal
      handleAction={handleAction}
      content={content}
      buttonText={hasNextStep ? "WHAT'S NEXT" : undefined}
    />
  )
}
