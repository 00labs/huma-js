import { TransactionResponse } from '@ethersproject/providers'
import {
  makePaymentWithReceivable,
  makePrincipalPaymentAndDrawdownWithReceivable,
} from '@huma-finance/sdk'
import {
  PoolInfoV2,
  toBigNumber,
  UnderlyingTokenInfo,
  upScale,
} from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'

import { PaymentType } from '.'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { LoadingModal } from '../../LoadingModal'
import { ViewOnExplorer } from '../../ViewOnExplorer'

type Props = {
  poolInfo: PoolInfoV2
  poolUnderlyingToken: UnderlyingTokenInfo
  paymentType: PaymentType
  paymentTokenId: string
  borrowTokenId?: string
  setSuccessTxReceipt: (txReceipt: ethers.ContractReceipt) => void
}

export function Transfer({
  poolInfo,
  poolUnderlyingToken,
  paymentType,
  paymentTokenId,
  borrowTokenId,
  setSuccessTxReceipt,
}: Props): React.ReactElement {
  const dispatch = useAppDispatch()
  const { account, provider } = useWeb3React()
  const { paymentAmount } = useAppSelector(selectWidgetState)
  const { decimals } = poolUnderlyingToken
  const paymentAmountBN = toBigNumber(
    upScale(paymentAmount!, decimals),
  ).toString()
  const [txHash, setTxHash] = useState('')

  useEffect(() => {
    const sendTx = async () => {
      if (provider) {
        try {
          let tx: TransactionResponse
          if (paymentType === PaymentType.PaymentWithReceivable) {
            tx = await makePaymentWithReceivable(
              provider.getSigner(),
              poolInfo.poolName,
              paymentTokenId,
              paymentAmountBN,
              false,
            )
          } else {
            tx = await makePrincipalPaymentAndDrawdownWithReceivable(
              provider.getSigner(),
              poolInfo.poolName,
              Number(paymentTokenId),
              paymentAmountBN,
              borrowTokenId!,
              paymentAmountBN,
            )
          }
          setTxHash(tx.hash)
          const txReceipt = await tx.wait()
          setSuccessTxReceipt(txReceipt)
          dispatch(setStep(WIDGET_STEP.Done))
        } catch (e) {
          console.error(e)
          dispatch(setStep(WIDGET_STEP.Error))
        }
      }
    }
    sendTx()
  }, [
    borrowTokenId,
    dispatch,
    paymentAmountBN,
    paymentTokenId,
    paymentType,
    poolInfo.poolName,
    provider,
    setSuccessTxReceipt,
  ])

  if (!account) {
    return <LoadingModal title='Pay' />
  }

  return (
    <LoadingModal
      title='Transaction Pending'
      description='Waiting for confirmation...'
    >
      <ViewOnExplorer txHash={txHash} />
    </LoadingModal>
  )
}
