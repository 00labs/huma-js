import {
  POOL_NAME,
  RealWorldReceivableInfoBase,
  useCreditStatsV2,
  usePoolInfoV2,
  usePoolUnderlyingTokenInfoV2,
} from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { BigNumber } from 'ethers'
import { useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ErrorModal } from '../../ErrorModal'
import { WidgetWrapper } from '../../WidgetWrapper'
import { ChoosePaymentType } from './1-ChoosePaymentType'
import { ChooseAmount } from './2-ChooseAmount'
import { ApproveAllowance } from './3-ApproveAllowance'
import { Transfer } from './6-Transfer'
import { Success } from './7-Success'
import { CreateReceivable } from './4-CreateReceivable'
import { ApproveReceivable } from './5-ApproveReceivable'

export enum PaymentType {
  PaymentWithReceivable,
  PaymentWithReceivableAndDrawdown,
}

/**
 * Credit line pool payment props V2
 * @typedef {Object} CreditLinePaymentPropsV2
 * @property {POOL_NAME} poolName The name of the pool.
 * @property {RealWorldReceivableInfoBase} rwReceivableInfo The receivable details.
 * @property {function():void} handleClose Function to notify to close the widget modal when user clicks the 'x' close button.
 * @property {function((number|undefined)):void|undefined} handleSuccess Optional function to notify that the credit line pool payment action is successful.
 */
export type ReceivableBackedCreditLinePaymentPropsV2 = {
  poolName: keyof typeof POOL_NAME
  rwReceivableInfo: RealWorldReceivableInfoBase
  handleClose: () => void
  handleSuccess?: (blockNumber?: number) => void
}

export function ReceivableBackedCreditLinePaymentV2({
  poolName: poolNameStr,
  rwReceivableInfo,
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
  const payoffAmount = BigNumber.from(rwReceivableInfo.receivableAmount).sub(
    rwReceivableInfo.paidAmount,
  )
  const [tokenId, setTokenId] = useState<string>()

  useEffect(() => {
    dispatch(setStep(WIDGET_STEP.ChoosePaymentType))
  }, [dispatch])

  if (!poolInfo || !creditRecord || !poolUnderlyingToken) {
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
        <CreateReceivable poolInfo={poolInfo} setTokenId={setTokenId} />
      )}
      {step === WIDGET_STEP.ApproveNFT && tokenId && (
        <ApproveReceivable poolInfo={poolInfo} tokenId={tokenId} />
      )}
      {step === WIDGET_STEP.Transfer && paymentType && (
        <Transfer
          poolInfo={poolInfo}
          poolUnderlyingToken={poolUnderlyingToken}
          paymentType={paymentType}
        />
      )}
      {step === WIDGET_STEP.Done && (
        <Success
          poolUnderlyingToken={poolUnderlyingToken}
          handleAction={handleClose}
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
