import { POOL_NAME, POOL_TYPE } from '@huma-finance/shared'
import { usePoolInfo } from '@huma-finance/web-shared'
import { useWeb3React } from '@web3-react/core'
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
import { ApproveAllowance } from './4-ApproveAllowance'
import { Permit } from './5-Permit'
import { Transfer } from './6-Transfer'
import { Success } from './7-Success'

export type StreamFactoringBorrowProps = {
  poolName: POOL_NAME
  poolType: POOL_TYPE
  payerAddress: string
  superToken: string
  currentFlowRate: string
  isOpen: boolean
  handleClose: () => void
  handleSuccess: (blockNumber: number) => void
}

export function StreamFactoringBorrow({
  poolName,
  poolType,
  payerAddress,
  superToken,
  currentFlowRate,
  isOpen,
  handleClose,
  handleSuccess,
}: StreamFactoringBorrowProps): React.ReactElement | null {
  const dispatch = useDispatch()
  const { account, chainId } = useWeb3React()
  const poolInfo = usePoolInfo(poolName, poolType, chainId)
  const { step, errorMessage } = useAppSelector(selectWidgetState)

  useEffect(() => {
    dispatch(setStep(WIDGET_STEP.Evaluation))
  }, [dispatch])

  if (!poolInfo) {
    return null
  }

  return (
    <WidgetWrapper
      isOpen={isOpen}
      handleClose={handleClose}
      handleSuccess={handleSuccess}
    >
      {step === WIDGET_STEP.Evaluation && (
        <Evaluation
          poolInfo={poolInfo}
          payerAddress={payerAddress}
          superToken={superToken}
        />
      )}
      {step === WIDGET_STEP.ChooseAmount && (
        <ChooseAmount poolInfo={poolInfo} currentFlowRate={currentFlowRate} />
      )}
      {step === WIDGET_STEP.ConfirmTransfer && <ConfirmTransfer />}
      {step === WIDGET_STEP.ApproveAllowance && (
        <ApproveAllowance poolInfo={poolInfo} />
      )}
      {step === WIDGET_STEP.Permit && account && (
        <Permit
          poolInfo={poolInfo}
          payerAddress={payerAddress}
          borrower={account}
          superToken={superToken}
        />
      )}
      {step === WIDGET_STEP.Transfer && <Transfer poolInfo={poolInfo} />}
      {step === WIDGET_STEP.Done && <Success handleAction={handleClose} />}
      {step === WIDGET_STEP.Error && (
        <ErrorModal
          title='Stream Borrowing'
          errorMessage={errorMessage}
          handleOk={handleClose}
        />
      )}
    </WidgetWrapper>
  )
}
