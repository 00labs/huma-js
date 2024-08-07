import {
  PoolInfoType,
  decodeLogs,
  downScale,
  formatMoney,
  ERC20_ABI,
} from '@huma-shan/core'
import { sendTxAtom } from '@huma-shan/web-core'
import React, { useEffect, useState } from 'react'

import { useAtom } from 'jotai'
import { TxDoneModal } from '../../TxDoneModal'

type Props = {
  poolInfo: PoolInfoType
  handleAction: () => void
}

export function Success({ poolInfo, handleAction }: Props): React.ReactElement {
  const { symbol, decimals } = poolInfo.poolUnderlyingToken
  const [{ txReceipt }] = useAtom(sendTxAtom)
  const [approvedAmount, setApprovedAmount] = useState<string | undefined>()

  useEffect(() => {
    if (txReceipt) {
      const [event] = decodeLogs(txReceipt.logs, ERC20_ABI)
      if (event) {
        const payedAmount = downScale(event.args.value.toString(), decimals)
        setApprovedAmount(payedAmount)
      }
    }
  }, [decimals, txReceipt])

  return (
    <TxDoneModal
      handleAction={handleAction}
      content={[
        `You successfully approved ${formatMoney(approvedAmount)} ${symbol}.`,
        `Your pool will automatically pay off the due amount on the credit line before the end of each billing cycle.`,
      ]}
    />
  )
}
