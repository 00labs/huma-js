import { useWeb3React } from '@web3-react/core'
import { BigNumber } from 'ethers'
import { POOL_NAME, POOL_TYPE } from '@huma-finance/core'
import { useAccountStats, usePoolInfo } from '@huma-finance/web-core'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ErrorModal } from '../../ErrorModal'
import { WidgetWrapper } from '../../WidgetWrapper'
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
  tokenId: string | BigNumber
  handleClose: () => void
  handleSuccess?: (blockNumber?: number) => void
}

export function InvoiceFactoringBorrow({
  poolName: poolNameStr,
  poolType: poolTypeStr,
  tokenId,
  handleClose,
  handleSuccess,
}: InvoiceFactoringBorrowProps): React.ReactElement | null {
  const dispatch = useDispatch()
  const { account, chainId, provider } = useWeb3React()
  const poolName = POOL_NAME[poolNameStr]
  const poolType = POOL_TYPE[poolTypeStr]
  const poolInfo = usePoolInfo(poolName, poolType, chainId)
  const { step, errorMessage } = useAppSelector(selectWidgetState)
  const [accountStats] = useAccountStats(
    poolName,
    poolType,
    chainId,
    account,
    provider,
  )

  useEffect(() => {
    dispatch(setStep(WIDGET_STEP.Evaluation))
  }, [dispatch])

  if (!poolInfo) {
    return null
  }

  return (
    <WidgetWrapper
      isOpen
      handleClose={handleClose}
      handleSuccess={handleSuccess}
    >
      {step === WIDGET_STEP.Evaluation && (
        <Evaluation poolInfo={poolInfo} tokenId={tokenId.toString()} />
      )}
      {step === WIDGET_STEP.ChooseAmount && (
        <ChooseAmount poolInfo={poolInfo} accountStats={accountStats} />
      )}
      {step === WIDGET_STEP.ConfirmTransfer && <ConfirmTransfer />}
      {step === WIDGET_STEP.ApproveNFT && (
        <ApproveNFT poolInfo={poolInfo} tokenId={tokenId.toString()} />
      )}
      {step === WIDGET_STEP.Transfer && (
        <Transfer poolInfo={poolInfo} tokenId={tokenId.toString()} />
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
