import {
  decodeLogs,
  downScale,
  formatMoney,
  PoolInfoType,
  sendTxAtom,
} from '@huma-finance/shared'
import transferAbi from '@huma-finance/shared/dist/abis/Transfer.json'
import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'

import { TxDoneModal } from '../../TxDoneModal'

type Props = {
  poolInfo: PoolInfoType
  handleAction: () => void
}

export function Success({ poolInfo, handleAction }: Props): React.ReactElement {
  const { symbol, decimals } = poolInfo.poolUnderlyingToken
  const [{ txReceipt }] = useAtom(sendTxAtom)
  const [payedAmount, setPayedAmount] = useState<string | undefined>()

  useEffect(() => {
    if (txReceipt) {
      const [event] = decodeLogs(txReceipt.logs, transferAbi)
      if (event) {
        const payedAmount = downScale(event.args.value.toString(), decimals)
        setPayedAmount(payedAmount)
      }
    }
  }, [decimals, txReceipt])

  const content = [
    `You successfully paid ${formatMoney(payedAmount)} ${symbol}.`,
  ]

  return <TxDoneModal handleAction={handleAction} content={content} />
}
