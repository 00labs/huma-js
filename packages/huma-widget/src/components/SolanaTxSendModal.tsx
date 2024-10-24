import { SolanaChainEnum } from '@huma-finance/shared'
import React, { useEffect, useState } from 'react'

import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Transaction } from '@solana/web3.js'
import { setError, setSolanaSignature } from '../store/widgets.reducers'
import { LoadingModal } from './LoadingModal'
import { SolanaViewOnExplorer } from './SolanaViewOnExplorer'
import { useAppDispatch } from '../hooks/useRedux'

type Props = {
  chainId: SolanaChainEnum
  tx?: Transaction
  handleSuccess: () => void
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
        const latestBlockHash = await connection.getLatestBlockhash()
        const signature = await sendTransaction(tx, connection)
        setSignature(signature)
        dispatch(setSolanaSignature(signature))

        await connection.confirmTransaction({
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature,
        })
        handleSuccess()
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
