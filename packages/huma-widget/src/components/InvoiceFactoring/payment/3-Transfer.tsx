import { useWeb3React } from '@web3-react/core'
import { PoolInfoType, toBigNumber, upScale } from '@huma-shan/core'
import React, { useCallback } from 'react'

import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { TxSendModal } from '../../TxSendModal'

type Props = {
  poolInfo: PoolInfoType
}

export function Transfer({ poolInfo }: Props): React.ReactElement {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const { decimals } = poolInfo.poolUnderlyingToken
  const { paymentAmount } = useAppSelector(selectWidgetState)
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
