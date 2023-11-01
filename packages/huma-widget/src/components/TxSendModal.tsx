import { useWeb3React } from '@web3-react/core'
import { Contract } from 'ethers'
import {
  PoolInfoType,
  sendTxAtom,
  TxStateType,
  useMount,
  usePoolContract,
} from '@huma-finance/shared'
import { useAtom } from 'jotai'
import React, { useEffect } from 'react'

import { useAppDispatch } from '../hooks/useRedux'
import { LoadingModal } from './LoadingModal'
import { ViewOnExplorer } from './ViewOnExplorer'

type Props = {
  poolInfo: PoolInfoType
  method: string
  params: unknown[]
  title?: string
  contract?: Contract
  handleSuccess?: () => void
}

export function TxSendModal({
  poolInfo,
  title,
  method,
  params,
  contract,
  handleSuccess,
}: Props): React.ReactElement {
  const dispatch = useAppDispatch()
  const { provider, chainId } = useWeb3React()
  const poolContract = usePoolContract(
    poolInfo.poolName,
    poolInfo.poolType,
    chainId,
    provider,
  )
  const [{ state, txHash }, send] = useAtom(sendTxAtom)

  useEffect(() => {
    if (state === TxStateType.Success) {
      if (handleSuccess) {
        handleSuccess()
      }
    }
  }, [dispatch, handleSuccess, state])

  useMount(() => {
    send({ contract: contract ?? poolContract!, method, params, provider })
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
