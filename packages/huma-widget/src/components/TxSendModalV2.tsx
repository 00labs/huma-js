import { TxStateType } from '@huma-finance/shared'
import { sendTxAtom, useMount } from '@huma-finance/web-shared'
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'ethers'
import { useAtom } from 'jotai'
import React, { useEffect } from 'react'

import { useAppDispatch } from '../hooks/useRedux'
import { LoadingModal } from './LoadingModal'
import { ViewOnExplorer } from './ViewOnExplorer'

type Props = {
  method: string
  params: unknown[]
  title?: string
  contract: Contract
  handleSuccess?: (options?: { txHash: string }) => void
}

export function TxSendModalV2({
  title,
  method,
  params,
  contract,
  handleSuccess,
}: Props): React.ReactElement {
  const dispatch = useAppDispatch()
  const { provider } = useWeb3React()

  const [{ state, txHash }, send] = useAtom(sendTxAtom)

  useEffect(() => {
    if (state === TxStateType.Success && txHash) {
      if (handleSuccess) {
        handleSuccess({ txHash })
      }
    }
  }, [dispatch, handleSuccess, state, txHash])

  useMount(() => {
    send({ contract, method, params, provider })
  })

  return (
    <LoadingModal
      title={title ?? 'Transaction Pending'}
      description='Waiting for confirmation...'
    >
      <ViewOnExplorer txHash={txHash} />
    </LoadingModal>
  )
}
