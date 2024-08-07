import { POOL_NAME } from '@huma-shan/core'
import {
  useCreditStatsV2,
  usePoolInfoV2,
  usePoolUnderlyingTokenInfoV2,
  useReceivableInfoV2,
} from '@huma-shan/web-core'
import { useWeb3React } from '@web3-react/core'
import { BigNumber, ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ErrorModal } from '../../ErrorModal'
import { WidgetWrapper } from '../../WidgetWrapper'
import { ChoosePaymentType } from './1-ChoosePaymentType'
import { ChooseAmount } from './2-ChooseAmount'
import { ApproveAllowance } from './3-ApproveAllowance'
import { CreateReceivable } from './4-CreateReceivable'
import { ApproveReceivable } from './5-ApproveReceivable'
import { Transfer } from './6-Transfer'
import { Success } from './7-Success'

export enum PaymentType {
  PaymentWithReceivable = 1,
  PaymentWithReceivableAndDrawdown = 2,
}

/**
 * Credit line pool payment props V2
 * @typedef {Object} CreditLinePaymentPropsV2
 * @property {POOL_NAME} poolName The name of the pool.
 * @property {tokenId} tokenID The receivable token id.
 * @property {function():void} handleClose Function to notify to close the widget modal when user clicks the 'x' close button.
 * @property {function((number|undefined)):void|undefined} handleSuccess Optional function to notify that the credit line pool payment action is successful.
 */
export type ReceivableBackedCreditLinePaymentPropsV2 = {
  poolName: keyof typeof POOL_NAME
  tokenId: string
  handleClose: () => void
  handleSuccess?: (blockNumber?: number) => void
}

export function ReceivableBackedCreditLinePaymentV2({
  poolName: poolNameStr,
  tokenId,
  handleClose,
  handleSuccess,
}: ReceivableBackedCreditLinePaymentPropsV2): React.ReactElement | null {
  const dispatch = useDispatch()
  const { account, chainId, provider } = useWeb3React()
  const poolName = POOL_NAME[poolNameStr]
  const poolInfo = usePoolInfoV2(poolName, chainId)
  const { step, errorMessage } = useAppSelector(selectWidgetState)
  const [{ creditRecord }] = useCreditStatsV2(poolName, account, provider)
  const poolUnderlyingToken = usePoolUnderlyingTokenInfoV2(poolName, provider)
  const [paymentType, setPaymentType] = useState<PaymentType>()

  const [borrowTokenId, setBorrowTokenId] = useState<string>()
  const paymentReceivableInfo = useReceivableInfoV2(poolName, tokenId, provider)
  const payoffAmount = paymentReceivableInfo
    ? BigNumber.from(paymentReceivableInfo.receivableAmount).sub(
        paymentReceivableInfo.paidAmount,
      )
    : BigNumber.from(0)
  const [successTxReceipt, setSuccessTxReceipt] =
    useState<ethers.ContractReceipt>()

  useEffect(() => {
    dispatch(setStep(WIDGET_STEP.ChoosePaymentType))
  }, [dispatch])

  if (
    !poolInfo ||
    !creditRecord ||
    !poolUnderlyingToken ||
    !paymentReceivableInfo
  ) {
    return (
      <WidgetWrapper
        isOpen
        isLoading
        loadingTitle='Pay'
        handleClose={handleClose}
        handleSuccess={handleSuccess}
      />
    )
  }

  return (
    <WidgetWrapper
      isOpen
      isLoading={!creditRecord}
      loadingTitle='Pay'
      handleClose={handleClose}
      handleSuccess={handleSuccess}
    >
      {step === WIDGET_STEP.ChoosePaymentType && (
        <ChoosePaymentType
          paymentType={paymentType}
          changePaymentType={setPaymentType}
        />
      )}
      {step === WIDGET_STEP.ChooseAmount && paymentType && (
        <ChooseAmount
          poolInfo={poolInfo}
          poolUnderlyingToken={poolUnderlyingToken}
          payoffAmount={payoffAmount}
          paymentType={paymentType}
        />
      )}
      {step === WIDGET_STEP.ApproveAllowance && paymentType && (
        <ApproveAllowance
          poolInfo={poolInfo}
          poolUnderlyingToken={poolUnderlyingToken}
          paymentType={paymentType}
        />
      )}
      {step === WIDGET_STEP.MintNFT && (
        <CreateReceivable
          poolInfo={poolInfo}
          poolUnderlyingToken={poolUnderlyingToken}
          setTokenId={setBorrowTokenId}
        />
      )}
      {step === WIDGET_STEP.ApproveNFT && borrowTokenId && (
        <ApproveReceivable poolInfo={poolInfo} tokenId={borrowTokenId} />
      )}
      {step === WIDGET_STEP.Transfer && paymentType && (
        <Transfer
          poolInfo={poolInfo}
          poolUnderlyingToken={poolUnderlyingToken}
          paymentType={paymentType}
          paymentTokenId={tokenId}
          borrowTokenId={borrowTokenId}
          setSuccessTxReceipt={setSuccessTxReceipt}
        />
      )}
      {step === WIDGET_STEP.Done && paymentType && successTxReceipt && (
        <Success
          poolUnderlyingToken={poolUnderlyingToken}
          paymentType={paymentType}
          handleAction={handleClose}
          successTxReceipt={successTxReceipt}
        />
      )}
      {step === WIDGET_STEP.Error && (
        <ErrorModal
          title='Pay'
          errorMessage={errorMessage}
          handleOk={handleClose}
        />
      )}
    </WidgetWrapper>
  )
}
