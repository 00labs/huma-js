import { useWeb3React } from '@web3-react/core'
import {
  PoolInfoType,
  sendTxAtom,
  txAtom,
  TxStateType,
  useInvoiceNFTContract,
} from '@huma-finance/shared'
import { useAtom } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import React, { useEffect } from 'react'

import { useAppDispatch } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { LoadingModal } from '../../LoadingModal'
import { ViewOnExplorer } from '../../ViewOnExplorer'

type Props = {
  poolInfo: PoolInfoType
  tokenId: string
}

export function ApproveNFT({ poolInfo, tokenId }: Props): React.ReactElement {
  const dispatch = useAppDispatch()
  const { provider } = useWeb3React()
  const [{ state, txHash }, send] = useAtom(sendTxAtom)
  const reset = useResetAtom(txAtom)
  const invoiceNFTContract = useInvoiceNFTContract(poolInfo.poolName)

  useEffect(() => {
    if (state === TxStateType.Success) {
      reset()
      dispatch(setStep(WIDGET_STEP.Transfer))
    }
  }, [dispatch, reset, state])

  useEffect(() => {
    send({
      contract: invoiceNFTContract!,
      method: 'approve',
      params: [poolInfo.pool, tokenId],
      provider,
    })
  }, [invoiceNFTContract, poolInfo.pool, provider, send, tokenId])

  return (
    <LoadingModal
      title='Approve Invoice Transfer'
      description='Waiting for approval confirmation...'
    >
      <ViewOnExplorer txHash={txHash} />
    </LoadingModal>
  )
}
