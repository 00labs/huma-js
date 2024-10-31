/* eslint-disable no-await-in-loop */
import { SolanaChainEnum, timeUtil } from '@huma-finance/shared'
import React, { useEffect, useState } from 'react'

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
        const signature = await sendTransaction(tx, connection)
        setSignature(signature)
        dispatch(setSolanaSignature(signature))

        let transactionConfirmed = false
        for (let i = 0; i < 30; i += 1) {
          timeUtil.sleep(1000)
          const result = await connection.getSignatureStatus(signature)
          if (result?.value?.confirmations) {
            transactionConfirmed = true
            break
          }
        }

        if (transactionConfirmed) {
          handleSuccess({ signature })
        } else {
          dispatch(
            setError({
              errorMessage: 'Transaction failed to confirm in time',
            }),
          )
        }
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
