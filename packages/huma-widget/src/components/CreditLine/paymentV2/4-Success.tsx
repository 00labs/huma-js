import {
  decodeLogs,
  downScale,
  formatNumber,
  sendTxAtom,
  TRANSFER_ABI,
  UnderlyingTokenInfo,
} from '@huma-finance/shared'
import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'

import { TxDoneModal } from '../../TxDoneModal'

type Props = {
  poolUnderlyingToken: UnderlyingTokenInfo
  handleAction: () => void
}

export function Success({
  poolUnderlyingToken,
  handleAction,
}: Props): React.ReactElement {
  const { symbol, decimals } = poolUnderlyingToken
  const [{ txReceipt }] = useAtom(sendTxAtom)
  const [paidAmount, setPaidAmount] = useState<string | undefined>()

  useEffect(() => {
    if (txReceipt) {
      const [event] = decodeLogs(txReceipt.logs, TRANSFER_ABI)
      if (event) {
        const paidAmount = downScale(event.args.value.toString(), decimals)
        setPaidAmount(paidAmount)
      }
    }
  }, [decimals, txReceipt])

  const content = [
    `You successfully paid ${formatNumber(paidAmount)} ${symbol}.`,
  ]

  return <TxDoneModal handleAction={handleAction} content={content} />
}
