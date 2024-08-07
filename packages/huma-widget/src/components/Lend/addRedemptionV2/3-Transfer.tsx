import { PoolInfoV2, UnderlyingTokenInfo } from '@huma-finance/shared'
import { useTrancheVaultContractV2 } from '@huma-finance/web-shared'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import React, { useCallback } from 'react'

import { TrancheInfo } from '.'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { TxSendModalV2 } from '../../TxSendModalV2'

type Props = {
  poolInfo: PoolInfoV2
  poolUnderlyingToken: UnderlyingTokenInfo
  trancheInfo: TrancheInfo
}

export function Transfer({
  poolInfo,
  poolUnderlyingToken,
  trancheInfo,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { decimals } = poolUnderlyingToken
  const { account, provider } = useWeb3React()
  const { redeemShares } = useAppSelector(selectWidgetState)
  const trancheVaultContract = useTrancheVaultContractV2(
    poolInfo.poolName,
    trancheInfo.tranche,
    provider,
    account,
  )
  const redeemSharesBN = ethers.utils.parseUnits(String(redeemShares), decimals)

  const handleSuccess = useCallback(() => {
    dispatch(setStep(WIDGET_STEP.Done))
  }, [dispatch])

  if (!trancheVaultContract) {
    return null
  }

  return (
    <TxSendModalV2
      contract={trancheVaultContract}
      method='addRedemptionRequest'
      params={[redeemSharesBN]}
      handleSuccess={handleSuccess}
    />
  )
}
