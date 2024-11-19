import { SolanaChainEnum } from '@huma-finance/shared'
import React, { useEffect, useState } from 'react'
import {
  buildOptimalTransactionFromConnection,
  extractWritableAccounts,
} from '@huma-finance/sdk'

import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Transaction } from '@solana/web3.js'
import { useAppDispatch } from '../hooks/useRedux'
import { setError, setSolanaSignature } from '../store/widgets.reducers'
import { LoadingModal } from './LoadingModal'
import { SolanaViewOnExplorer } from './SolanaViewOnExplorer'

type Props = {
  chainId: SolanaChainEnum
  tx?: Transaction
  handleSuccess: (options?: { signature: string }) => void
}

export function SolanaTxSendModal({
  chainId,
  tx,
  handleSuccess,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { sendTransaction } = useWallet()
  const { connection } = useConnection()
  const [signature, setSignature] = useState<string>('')

  useEffect(() => {
    async function sendTx() {
      if (!connection || !tx) {
        return
      }

      try {
        const lockedWritableAccounts = extractWritableAccounts(tx)
        const optimizedTx = await buildOptimalTransactionFromConnection(
          tx,
          lockedWritableAccounts,
          connection,
        )
        const signature = await sendTransaction(optimizedTx, connection, {
          maxRetries: 5,
          preflightCommitment: 'confirmed',
        })
        setSignature(signature)
        dispatch(setSolanaSignature(signature))
        await connection.confirmTransaction({
          blockhash: optimizedTx.recentBlockhash!,
          lastValidBlockHeight: optimizedTx.lastValidBlockHeight!,
          signature,
        })
        handleSuccess({ signature })
      } catch (error: unknown) {
        const err = error as Error
        dispatch(setError({ errorMessage: err?.message || '' }))
      }
    }
    sendTx()
  }, [connection, dispatch, handleSuccess, sendTransaction, tx])

  return (
    <LoadingModal
      title='Transaction Pending'
      description='Waiting for confirmation...'
    >
      <SolanaViewOnExplorer chainId={chainId} signature={signature} />
    </LoadingModal>
  )
}
