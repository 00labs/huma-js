import {
  PoolInfoV2,
  TrancheType,
  useTrancheVaultContractV2,
} from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import React, { useCallback } from 'react'

import { useAppDispatch } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { TxSendModalV2 } from '../../TxSendModalV2'

type Props = {
  poolInfo: PoolInfoV2
  selectedTranche: TrancheType
}

export function Transfer({
  poolInfo,
  selectedTranche,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { account, provider } = useWeb3React()
  const trancheVaultContract = useTrancheVaultContractV2(
    poolInfo.poolName,
    selectedTranche,
    provider,
    account,
  )

  const handleSuccess = useCallback(() => {
    dispatch(setStep(WIDGET_STEP.Done))
  }, [dispatch])

  if (!trancheVaultContract || !account) {
    return null
  }

  return (
    <TxSendModalV2
      contract={trancheVaultContract}
      method='disburse'
      params={[account]}
      handleSuccess={handleSuccess}
    />
  )
}
