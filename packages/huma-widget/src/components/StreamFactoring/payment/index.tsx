import { useWeb3React } from '@web3-react/core'
import { PoolInfoType, useAccountStats } from '@huma-finance/core'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ErrorModal } from '../../ErrorModal'
import { WidgetWrapper } from '../../WidgetWrapper'
import { ChooseAmount } from './ChooseAmount'
import { Success } from './Success'
import { Transfer } from './Transfer'

type Props = {
  poolInfo: PoolInfoType
  isOpen: boolean
  handleClose: () => void
  handleSuccess: (blockNumber: number) => void
}

export function StreamFactoringPayment({
  poolInfo,
  isOpen,
  handleClose,
  handleSuccess,
}: Props): React.ReactElement | null {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const { step, errorMessage } = useAppSelector(selectWidgetState)
  const [{ creditRecord }] = useAccountStats(
    poolInfo.poolName,
    poolInfo.poolType,
    account,
  )

  useEffect(() => {
    dispatch(setStep(WIDGET_STEP.ChooseAmount))
  }, [dispatch])

  return (
    <WidgetWrapper
      isOpen={isOpen}
      isLoading={!creditRecord}
      loadingTitle='Payment'
      handleClose={handleClose}
      handleSuccess={handleSuccess}
    >
      {step === WIDGET_STEP.ChooseAmount && (
        <ChooseAmount creditRecord={creditRecord!} poolInfo={poolInfo} />
      )}
      {step === WIDGET_STEP.Transfer && <Transfer poolInfo={poolInfo} />}
      {step === WIDGET_STEP.Done && (
        <Success poolInfo={poolInfo} handleAction={handleClose} />
      )}
      {step === WIDGET_STEP.Error && (
        <ErrorModal
          title='Make Payment'
          errorMessage={errorMessage}
          handleOk={handleClose}
        />
      )}
    </WidgetWrapper>
  )
}
