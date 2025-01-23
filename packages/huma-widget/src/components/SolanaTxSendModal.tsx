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
  const { publicKey, signTransaction, sendTransaction } = useWallet()
  const { connection } = useConnection()
  const [signature, setSignature] = useState<string>('')

  useEffect(() => {
    async function sendTx() {
      if (!connection || !tx || !publicKey || !signTransaction) {
        return
      }

      let signatureResult = ''
      try {
        // Optimize transaction
        const recentBlockhash = await connection.getLatestBlockhash('confirmed')
        tx.recentBlockhash = recentBlockhash.blockhash
        tx.lastValidBlockHeight = recentBlockhash.lastValidBlockHeight
        tx.feePayer = publicKey
        const txAccounts = extractWritableAccounts(tx)
        const optimizedTx = await buildOptimalTransactionFromConnection(
          tx,
          txAccounts,
          connection,
          chainId,
          publicKey,
          process.env.REACT_APP_HELIUS_API_KEY,
        )
        signatureResult = await sendTransaction(optimizedTx, connection, {
          preflightCommitment: 'confirmed',
          skipPreflight: true,
        })
        setSignature(signatureResult)
        dispatch(setSolanaSignature(signatureResult))
        await connection.confirmTransaction({
          blockhash: optimizedTx.recentBlockhash!,
          lastValidBlockHeight: optimizedTx.lastValidBlockHeight!,
          signature: signatureResult,
        })
        const txResult = await connection.getParsedTransaction(
          signatureResult,
          'confirmed',
        )
        if (txResult?.meta?.err) {
          dispatch(
            setError({
              errorMessage:
                'Your transaction was confirmed but had errors. Please check the transaction details on the explorer for more information.',
            }),
          )
          return
        }
        handleSuccess({ signature: signatureResult })
      } catch (error: unknown) {
        let signatureStatusRetries = 0

        while (signatureStatusRetries < 5) {
          // Attempt to load the signature status using transaction history
          // eslint-disable-next-line no-await-in-loop
          await sleep(1000)
          // eslint-disable-next-line no-await-in-loop
          const result = await connection.getSignatureStatus(signatureResult, {
            searchTransactionHistory: true,
          })
          if (
            result?.value?.confirmationStatus === 'finalized' ||
            result?.value?.confirmationStatus === 'confirmed'
          ) {
            if (result?.value?.err) {
              dispatch(
                setError({
                  errorMessage:
                    'Your transaction was confirmed but had errors. Please check the transaction details on the explorer for more information.',
                }),
              )
              return
            }
            handleSuccess({ signature: signatureResult })
            return
          }

          signatureStatusRetries += 1
        }

        const err = error as Error

        console.log(err)
        dispatch(setError({ errorMessage: err?.message || '' }))
      }
    }
    sendTx()
  }, [
    chainId,
    connection,
    dispatch,
    handleSuccess,
    publicKey,
    sendTransaction,
    signTransaction,
    tx,
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
