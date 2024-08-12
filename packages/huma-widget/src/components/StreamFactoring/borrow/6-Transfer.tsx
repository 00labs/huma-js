import { PoolInfoType } from '@huma-finance/shared'
import { useMultiSendContract } from '@huma-finance/web-shared'
import React, { useCallback } from 'react'

import { useWeb3React } from '@web3-react/core'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { TxSendModal } from '../../TxSendModal'

type Props = {
  poolInfo: PoolInfoType
}

export function Transfer({ poolInfo }: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { chainId, provider } = useWeb3React()
  const { multisend } = useAppSelector(selectWidgetState)
  const multiSendContract = useMultiSendContract(chainId, provider)

  const handleSuccess = useCallback(() => {
    dispatch(setStep(WIDGET_STEP.Done))
  }, [dispatch])

  if (!multisend || !multiSendContract) {
    return null
  }

  return (
    <TxSendModal
      poolInfo={poolInfo}
      contract={multiSendContract}
      title='Transfer Tradable Stream and Money'
      method='multisend'
      params={[multisend.addresses, multisend.callData]}
      handleSuccess={handleSuccess}
    />
  )
}
