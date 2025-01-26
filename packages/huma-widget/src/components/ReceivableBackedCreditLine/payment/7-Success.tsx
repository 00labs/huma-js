import {
  decodeLogs,
  downScale,
  formatNumber,
  TRANSFER_ABI,
  UnderlyingTokenInfo,
} from '@huma-finance/shared'
import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'

import { PaymentType } from '.'
import { TxDoneModal } from '../../TxDoneModal'

type Props = {
  poolUnderlyingToken: UnderlyingTokenInfo
  paymentType: PaymentType
  successTxReceipt: ethers.ContractReceipt
  handleAction: () => void
}

export function Success({
  poolUnderlyingToken,
  paymentType,
  successTxReceipt,
  handleAction,
}: Props): React.ReactElement {
  const { symbol, decimals } = poolUnderlyingToken
  const [paidAmount, setPaidAmount] = useState<string | undefined>()

  useEffect(() => {
    if (successTxReceipt) {
      const [event] = decodeLogs(successTxReceipt.logs, TRANSFER_ABI)
      if (event) {
        const paidAmount = downScale(event.args.value.toString(), decimals)
        setPaidAmount(paidAmount)
      }
    }
  }, [decimals, successTxReceipt])

  const amountFormatted = formatNumber(paidAmount)
  const content =
    paymentType === PaymentType.PaymentWithReceivable
      ? [`You successfully paid ${amountFormatted} ${symbol}.`]
      : [
          `You successfully paid ${amountFormatted} ${symbol} and borrowed ${amountFormatted} ${symbol}.`,
        ]

  return <TxDoneModal handleAction={handleAction} content={content} />
}
