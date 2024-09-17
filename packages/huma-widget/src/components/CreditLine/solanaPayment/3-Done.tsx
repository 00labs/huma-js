import { formatNumber, SolanaPoolInfo } from '@huma-finance/shared'
import React, { useEffect, useMemo, useState } from 'react'

import { useConnection } from '@solana/wallet-adapter-react'
import { useAppSelector } from '../../../hooks/useRedux'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { SolanaTxDoneModal } from '../../SolanaTxDoneModal'

type Props = {
  poolInfo: SolanaPoolInfo
  handleAction: () => void
}

export function Done({ poolInfo, handleAction }: Props): React.ReactElement {
  const { solanaSignature } = useAppSelector(selectWidgetState)
  const { symbol } = poolInfo.underlyingMint
  const { connection } = useConnection()
  const [tokensPaid, setTokensPaid] = useState<number | null>(null)

  useEffect(() => {
    const fetchTokensPaid = async () => {
      if (!solanaSignature) {
        return
      }

      const txData = await connection.getTransaction(solanaSignature, {
        maxSupportedTransactionVersion: 2,
      })

      const preTokenBalance =
        txData?.meta?.preTokenBalances?.[1]?.uiTokenAmount?.uiAmount
      const postTokenBalance =
        txData?.meta?.postTokenBalances?.[1]?.uiTokenAmount?.uiAmount
      if (preTokenBalance && postTokenBalance) {
        setTokensPaid(preTokenBalance - postTokenBalance)
      }
    }

    fetchTokensPaid()
  }, [connection, solanaSignature])

  const content = useMemo(() => {
    if (tokensPaid !== null) {
      return [`You successfully paid ${formatNumber(tokensPaid)} ${symbol}.`]
    }

    return ['Your payment to the pool was successful']
  }, [tokensPaid, symbol])

  return (
    <SolanaTxDoneModal
      handleAction={handleAction}
      content={content}
      chainId={poolInfo.chainId}
      solanaSignature={solanaSignature}
      buttonText='DONE'
    />
  )
}
