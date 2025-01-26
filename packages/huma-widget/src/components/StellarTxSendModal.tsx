import React, { useEffect } from 'react'
import AssembledTransaction from '@stellar/stellar-sdk'
import { useAppDispatch } from '../hooks/useRedux'
import { setError, setTxHash } from '../store/widgets.reducers'
import { LoadingModal } from './LoadingModal'

type Props = {
  tx?: typeof AssembledTransaction
  handleSuccess: () => void
}

export function StellarTxSendModal({
  tx,
  handleSuccess,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()

  useEffect(() => {
    async function sendTx() {
      if (!tx) {
        return
      }

      try {
        const txResult = await tx.signAndSend()
        const { hash } = txResult.sendTransactionResponse
        dispatch(setTxHash(hash))
        handleSuccess()
      } catch (error: unknown) {
        const err = error as Error
        console.error(err)
        dispatch(setError({ errorMessage: err?.message || '' }))
      }
    }
    sendTx()
  }, [dispatch, handleSuccess, tx])

  return (
    <LoadingModal
      title='Transaction Pending'
      description='Waiting for confirmation...'
    />
  )
}
