import {
  PoolInfoV2,
  toBigNumber,
  UnderlyingTokenInfo,
  upScale,
} from '@huma-finance/core'
import { useCreditContractV2 } from '@huma-finance/web-core'
import { useWeb3React } from '@web3-react/core'
import React, { useCallback } from 'react'

import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { LoadingModal } from '../../LoadingModal'
import { TxSendModalV2 } from '../../TxSendModalV2'

type Props = {
  poolInfo: PoolInfoV2
  poolUnderlyingToken: UnderlyingTokenInfo
}

export function Transfer({
  poolInfo,
  poolUnderlyingToken,
}: Props): React.ReactElement {
  const dispatch = useAppDispatch()
  const { account, provider } = useWeb3React()
  const { paymentAmount } = useAppSelector(selectWidgetState)
  const { decimals } = poolUnderlyingToken
  const paymentBigNumber = toBigNumber(upScale(paymentAmount!, decimals))
  const creditContract = useCreditContractV2(
    poolInfo.poolName,
    provider,
    account,
  )

  const handleSuccess = useCallback(() => {
    dispatch(setStep(WIDGET_STEP.Done))
  }, [dispatch])

  if (!account || !creditContract) {
    return <LoadingModal title='Pay' />
  }

  return (
    <TxSendModalV2
      title='Pay'
      contract={creditContract}
      method='makePayment'
      params={[account, paymentBigNumber]}
      handleSuccess={handleSuccess}
    />
  )
}
