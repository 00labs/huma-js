import { sendTxAtom, TxStateType, useMount } from '@huma-finance/shared'
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
  handleSuccess?: () => void
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
    if (state === TxStateType.Success) {
      if (handleSuccess) {
        handleSuccess()
      }
    }
  }, [dispatch, handleSuccess, state])

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
