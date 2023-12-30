import {
  CURRENCY_CODE,
  PoolInfoV2,
  sendTxAtom,
  txAtom,
  TxStateType,
  useReceivableContractV2,
} from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import { BigNumber, ContractReceipt } from 'ethers'
import { useAtom } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import moment from 'moment'
import React, { useCallback, useEffect } from 'react'

import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { LoadingModal } from '../../LoadingModal'
import { ViewOnExplorer } from '../../ViewOnExplorer'

type Props = {
  poolInfo: PoolInfoV2
  setTokenId: (tokenId: string) => void
}

export function CreateReceivable({
  poolInfo,
  setTokenId,
}: Props): React.ReactElement {
  const dispatch = useAppDispatch()
  const { provider, account } = useWeb3React()
  const { paymentAmount } = useAppSelector(selectWidgetState)
  const [{ state, txHash, txReceipt }, send] = useAtom(sendTxAtom)
  const reset = useResetAtom(txAtom)
  const receivableContract = useReceivableContractV2(
    poolInfo.poolName,
    provider,
    account,
  )

  const getTokenIdFromReceipt = useCallback((txReceipt: ContractReceipt) => {
    if (!Array.isArray(txReceipt.events)) {
      return undefined
    }
    const event = txReceipt.events.find(
      (event) => event.event === 'ReceivableCreated',
    )
    if (!event || !event.args!! || !event.args?.tokenId) {
      return undefined
    }
    return event.args.tokenId.toString() as string
  }, [])

  useEffect(() => {
    if (state === TxStateType.Success && txReceipt) {
      const tokenId = getTokenIdFromReceipt(txReceipt)
      if (tokenId) {
        setTokenId(tokenId)
      }
      reset()
      dispatch(setStep(WIDGET_STEP.ApproveNFT))
    }
  }, [dispatch, getTokenIdFromReceipt, reset, setTokenId, state, txReceipt])

  useEffect(() => {
    if (receivableContract) {
      const paymentAmountBN = BigNumber.from(paymentAmount)
      const maturityDate = moment().add(1, 'months').unix()
      send({
        contract: receivableContract,
        method: 'createReceivable',
        params: [CURRENCY_CODE.USD, paymentAmountBN, maturityDate, ''],
        provider,
      })
    }
  }, [paymentAmount, provider, receivableContract, send])

  return (
    <LoadingModal
      title='Create Receivable'
      description='Waiting for confirmation...'
    >
      <ViewOnExplorer txHash={txHash} />
    </LoadingModal>
  )
}
