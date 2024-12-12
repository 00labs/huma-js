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
  const { sendTransaction } = useWallet()
  const { connection } = useConnection()
  const [signature, setSignature] = useState<string>('')

  useEffect(() => {
    async function sendTx() {
      if (!connection || !tx) {
        return
      }

      let signatureResult = ''
      try {
        // Optimize transaction
        const lockedWritableAccounts = extractWritableAccounts(tx)
        const optimizedTx = await buildOptimalTransactionFromConnection(
          tx,
          lockedWritableAccounts,
          connection,
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
            handleSuccess({ signature: signatureResult })
            return
          }

          signatureStatusRetries += 1
        }

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
