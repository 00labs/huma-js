import { PoolInfoV2, TrancheType } from '@huma-finance/shared'
import { useTrancheVaultContractV2 } from '@huma-finance/web-shared'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import React, { useCallback } from 'react'

import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { TxSendModalV2 } from '../../TxSendModalV2'

type Props = {
  poolInfo: PoolInfoV2
  trancheType: TrancheType
}

export function Transfer({
  poolInfo,
  trancheType,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { account, provider } = useWeb3React()
  const { supplyAmount } = useAppSelector(selectWidgetState)
  const { decimals } = poolInfo.poolUnderlyingToken
  const supplyBigNumber = ethers.utils.parseUnits(
    String(supplyAmount),
    decimals,
  )
  const trancheVaultContract = useTrancheVaultContractV2(
    poolInfo.poolName,
    trancheType,
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
      method='deposit'
      params={[supplyBigNumber]}
      handleSuccess={handleSuccess}
    />
  )
}
