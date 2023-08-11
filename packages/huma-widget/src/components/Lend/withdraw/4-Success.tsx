import { useWeb3React } from '@web3-react/core'
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
  const { account } = useWeb3React()
  const { poolUnderlyingToken } = poolInfo
  const [{ txReceipt }] = useAtom(sendTxAtom)
  const { symbol, decimals, address } = poolUnderlyingToken
  const [withdrawAmount, setWithdrawAmount] = useState<string | undefined>()

  useEffect(() => {
    if (txReceipt) {
      const events = decodeLogs(txReceipt.logs, transferAbi)
      if (events) {
        events.forEach((event) => {
          const { from, to, value } = event.args
          if (
            from.toLowerCase() === poolInfo.pool.toLowerCase() &&
            to.toLowerCase() === account?.toLowerCase()
          ) {
            setWithdrawAmount(downScale(value.toString(), decimals))
          }
        })
      }
    }
  }, [account, address, decimals, poolInfo.pool, txReceipt])

  const content = [
    `You successfully withdrawn ${formatMoney(withdrawAmount)} ${symbol}.`,
  ]

  return <TxDoneModal handleAction={handleAction} content={content} />
}
