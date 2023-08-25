import { useWeb3React } from '@web3-react/core'
import { RequestLogicTypes } from '@requestnetwork/types'
import {
  POOL_NAME,
  POOL_TYPE,
  useAccountStats,
  usePoolInfo,
} from '@huma-finance/shared'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { RequestNetwork } from '@requestnetwork/request-client.js'
import { getReceivableTokenIdForRequest } from '@requestnetwork/payment-processor'
import { BigNumberish } from 'ethers'

import { useAppSelector } from '../../hooks/useRedux'
import { setStep } from '../../store/widgets.reducers'
import { selectWidgetState } from '../../store/widgets.selectors'
import { WIDGET_STEP } from '../../store/widgets.store'
import { ErrorModal } from '../ErrorModal'
import { WidgetWrapper } from '../WidgetWrapper'
import { Evaluation } from './1-Evaluation'
import { ChooseAmount } from './2-ChooseAmount'
import { ConfirmTransfer } from './3-ConfirmTransfer'
import { ApproveNFT } from './4-ApproveNFT'
import { Transfer } from './5-Transfer'
import { Success } from './6-Success'

/**
 * Invoice factoring pool borrow props
 * @typedef {Object} InvoiceFactoringBorrowProps
 * @property {POOL_NAME} poolName The name of the pool.
 * @property {POOL_TYPE} poolType The type of the pool.
 * @property {string|BigNumber} tokenId The NFT token id representing invoice.
 * @property {function():void} handleClose Function to notify to close the widget modal when user clicks the 'x' close button.
 * @property {function((number|undefined)):void|undefined} handleSuccess Optional function to notify that the invoice pool borrow action is successful.
 */
export interface InvoiceFactoringBorrowProps {
  poolName: keyof typeof POOL_NAME
  poolType: keyof typeof POOL_TYPE
  requestId: RequestLogicTypes.RequestId
  handleClose: () => void
  handleSuccess?: (blockNumber?: number) => void
}

export function InvoiceFactoringBorrow({
  poolName: poolNameStr,
  poolType: poolTypeStr,
  requestId,
  handleClose,
  handleSuccess,
}: InvoiceFactoringBorrowProps): React.ReactElement | null {
  const dispatch = useDispatch()
  const { account, provider } = useWeb3React()
  const poolName = POOL_NAME[poolNameStr]
  const poolType = POOL_TYPE[poolTypeStr]
  const poolInfo = usePoolInfo(poolName, poolType)
  const { step, errorMessage } = useAppSelector(selectWidgetState)
  const [accountStats] = useAccountStats(poolName, poolType, account)
  const [tokenId, setTokenId] = useState<BigNumberish>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    dispatch(setStep(WIDGET_STEP.Evaluation))
  }, [dispatch])

  useEffect(() => {
    if (provider == null) {
      return () => {} // Return empty func to satisty consistent return lint rule
    }

    // Refetch every 5 seconds until requestData is non-null
    const interval = setInterval(() => {
      async function getInvoice() {
        if (provider == null) {
          return
        }

        const requestNetwork = new RequestNetwork({
          nodeConnectionConfig: {
            baseURL: `https://xdai.gateway.request.network/`,
          },
        })
        const request = await requestNetwork.fromRequestId(requestId)
        const requestData = request.getData()
        const tokenId = await getReceivableTokenIdForRequest(
          requestData,
          provider,
        )

        // Check if token ID exists yet for this request
        if (tokenId) {
          setTokenId(tokenId)
          setIsLoading(false)
          clearInterval(interval)
        }
      }
      getInvoice()
    }, 5000)

    return () => clearInterval(interval)
  }, [provider, requestId])

  if (!poolInfo) {
    return null
  }

  return (
    <WidgetWrapper
      isOpen
      isLoading={isLoading}
      handleClose={handleClose}
      handleSuccess={handleSuccess}
    >
      {step === WIDGET_STEP.Evaluation && (
        <Evaluation poolInfo={poolInfo} tokenId={tokenId!.toString()} />
      )}
      {step === WIDGET_STEP.ChooseAmount && (
        <ChooseAmount poolInfo={poolInfo} accountStats={accountStats} />
      )}
      {step === WIDGET_STEP.ConfirmTransfer && <ConfirmTransfer />}
      {step === WIDGET_STEP.ApproveNFT && (
        <ApproveNFT poolInfo={poolInfo} tokenId={tokenId!.toString()} />
      )}
      {step === WIDGET_STEP.Transfer && (
        <Transfer poolInfo={poolInfo} tokenId={tokenId!.toString()} />
      )}
      {step === WIDGET_STEP.Done && <Success handleAction={handleClose} />}
      {step === WIDGET_STEP.Error && (
        <ErrorModal
          title='Invoice Factoring'
          errorMessage={errorMessage}
          handleOk={handleClose}
        />
      )}
    </WidgetWrapper>
  )
}
