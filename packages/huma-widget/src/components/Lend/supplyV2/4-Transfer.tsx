import {
  PoolInfoV2,
  useTrancheVaultContractV2,
  VaultType,
} from '@huma-finance/shared'
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
  vaultType: VaultType
}

export function Transfer({
  poolInfo,
  vaultType,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { chainId, account } = useWeb3React()
  const { supplyAmount } = useAppSelector(selectWidgetState)
  const { decimals } = poolInfo.poolUnderlyingToken
  const supplyBigNumber = ethers.utils.parseUnits(
    String(supplyAmount),
    decimals,
  )
  const trancheVaultContract = useTrancheVaultContractV2(
    poolInfo.poolName,
    vaultType,
    chainId,
    {},
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
      params={[supplyBigNumber, account]}
      handleSuccess={handleSuccess}
    />
  )
}
