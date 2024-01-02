import {
  decodeLogs,
  downScale,
  formatMoney,
  sendTxAtom,
  TRANSFER_ABI,
  UnderlyingTokenInfo,
} from '@huma-finance/shared'
import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'

import { TxDoneModal } from '../../TxDoneModal'
import { PaymentType } from '.'

type Props = {
  poolUnderlyingToken: UnderlyingTokenInfo
  paymentType: PaymentType
  handleAction: () => void
}

export function Success({
  poolUnderlyingToken,
  paymentType,
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

  const amoutFormatted = formatMoney(paidAmount)
  const content =
    paymentType === PaymentType.PaymentWithReceivable
      ? [`You successfully paid ${amoutFormatted} ${symbol}.`]
      : [
          `You successfully paid ${amoutFormatted} ${symbol} and borrowed ${amoutFormatted} ${symbol}.`,
        ]

  return <TxDoneModal handleAction={handleAction} content={content} />
}
