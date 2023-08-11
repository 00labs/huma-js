import { useWeb3React } from '@web3-react/core'
import { PoolInfoType, toBigNumber, upScale } from '@huma-finance/shared'
import React, { useCallback } from 'react'

import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { TxSendModal } from '../../TxSendModal'

type Props = {
  poolInfo: PoolInfoType
}

export function Transfer({ poolInfo }: Props): React.ReactElement {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const { paymentAmount } = useAppSelector(selectWidgetState)
  const { decimals } = poolInfo.poolUnderlyingToken
  const paymentBigNumber = toBigNumber(upScale(paymentAmount!, decimals))

  const handleSuccess = useCallback(() => {
    dispatch(setStep(WIDGET_STEP.Done))
  }, [dispatch])

  return (
    <TxSendModal
      poolInfo={poolInfo}
      method='makePayment'
      params={[account, paymentBigNumber]}
      handleSuccess={handleSuccess}
    />
  )
}
