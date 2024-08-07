import { PoolInfoV2, TxStateType } from '@huma-finance/core'
import {
  sendTxAtom,
  txAtom,
  useReceivableContractV2,
} from '@huma-finance/web-core'
import { useWeb3React } from '@web3-react/core'
import { useAtom } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import React, { useEffect } from 'react'

import { useAppDispatch } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { LoadingModal } from '../../LoadingModal'
import { ViewOnExplorer } from '../../ViewOnExplorer'

type Props = {
  poolInfo: PoolInfoV2
  tokenId: string
}

export function ApproveReceivable({
  poolInfo,
  tokenId,
}: Props): React.ReactElement {
  const dispatch = useAppDispatch()
  const { provider, account } = useWeb3React()
  const [{ state, txHash }, send] = useAtom(sendTxAtom)
  const reset = useResetAtom(txAtom)
  const receivableContract = useReceivableContractV2(
    poolInfo.poolName,
    provider,
    account,
  )

  useEffect(() => {
    if (state === TxStateType.Success) {
      reset()
      dispatch(setStep(WIDGET_STEP.Transfer))
    }
  }, [dispatch, reset, state])

  useEffect(() => {
    if (receivableContract) {
      send({
        contract: receivableContract,
        method: 'approve',
        params: [poolInfo.poolCredit, tokenId],
        provider,
      })
    }
  }, [poolInfo.poolCredit, provider, receivableContract, send, tokenId])

  return (
    <LoadingModal
      title='Approve Receivable'
      description='Waiting for approval confirmation...'
    >
      <ViewOnExplorer txHash={txHash} />
    </LoadingModal>
  )
}
