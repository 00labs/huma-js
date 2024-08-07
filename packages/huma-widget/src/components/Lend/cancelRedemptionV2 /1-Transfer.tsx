import { PoolInfoV2, TrancheType } from '@huma-shan/core'
import { useTrancheVaultContractV2 } from '@huma-shan/web-core'
import { useWeb3React } from '@web3-react/core'
import React, { useCallback } from 'react'

import { RedemptionInfo } from '.'
import { useAppDispatch } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { TxSendModalV2 } from '../../TxSendModalV2'

type Props = {
  poolInfo: PoolInfoV2
  trancheType: TrancheType
  redemptionInfo: RedemptionInfo
}

export function Transfer({
  poolInfo,
  trancheType,
  redemptionInfo,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { account, provider } = useWeb3React()
  const trancheVaultContract = useTrancheVaultContractV2(
    poolInfo.poolName,
    trancheType,
    provider,
    account,
  )

  const handleSuccess = useCallback(() => {
    dispatch(setStep(WIDGET_STEP.Done))
  }, [dispatch])

  if (!trancheVaultContract) {
    return null
  }

  return (
    <TxSendModalV2
      contract={trancheVaultContract}
      method='cancelRedemptionRequest'
      params={[redemptionInfo.shares]}
      handleSuccess={handleSuccess}
    />
  )
}
