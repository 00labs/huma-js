import { sleep, SolanaChainEnum } from '@huma-finance/shared'
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
  const { sendTransaction, signTransaction, publicKey } = useWallet()
  const { connection } = useConnection()
  const [signature, setSignature] = useState<string>('')

  useEffect(() => {
    async function sendTx() {
      if (!connection || !tx || !publicKey || !signTransaction) {
        return
      }

      try {
        // Optimize transaction
        const lockedWritableAccounts = extractWritableAccounts(tx)
        const optimizedTx = await buildOptimalTransactionFromConnection(
          tx,
          lockedWritableAccounts,
          connection,
        )
        optimizedTx.feePayer = publicKey

        // Sign and serialize transaction
        const signedTx = await signTransaction(optimizedTx)
        signedTx.recentBlockhash = optimizedTx.recentBlockhash
        signedTx.lastValidBlockHeight = optimizedTx.lastValidBlockHeight
        const rawTransaction = signedTx.serialize()

        // Try to send raw transaction multiple times through RPC
        let blockheight = await connection.getBlockHeight()
        let signature
        let sendCount = 0
        while (blockheight < signedTx.lastValidBlockHeight! && sendCount < 10) {
          console.log(blockheight)
          signature = connection.sendRawTransaction(rawTransaction, {
            preflightCommitment: 'confirmed',
            skipPreflight: true,
          })
          /* eslint-disable no-await-in-loop */
          await sleep(500)
          /* eslint-disable no-await-in-loop */
          blockheight = await connection.getBlockHeight()
          sendCount += 1
        }

        signature = await signature
        if (!signature) {
          dispatch(
            setError({
              errorMessage:
                'Failed to send transaction due to transaction signature expiration (~1.5 minutes). Please try again.',
            }),
          )
          return
        }

        // Confirm transaction
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
  }, [
    connection,
    dispatch,
    handleSuccess,
    sendTransaction,
    tx,
    publicKey,
    signTransaction,
  ])

  return (
    <LoadingModal
      title='Transaction Pending'
      description='Waiting for confirmation...'
    >
      <SolanaViewOnExplorer chainId={chainId} signature={signature} />
    </LoadingModal>
  )
}
