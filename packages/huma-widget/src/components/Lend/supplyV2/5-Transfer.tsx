import {
  FirstLossCoverIndex,
  PoolInfoV2,
  TrancheType,
  UnderlyingTokenInfo,
  useFirstLossCoverContractV2,
  useTrancheVaultContractV2,
} from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import React, { useCallback } from 'react'

import { SupplyType } from '.'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { TxSendModalV2 } from '../../TxSendModalV2'

type Props = {
  poolInfo: PoolInfoV2
  poolUnderlyingToken: UnderlyingTokenInfo
  selectedSupplyType: SupplyType
}

export function Transfer({
  poolInfo,
  poolUnderlyingToken,
  selectedSupplyType,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { account, provider } = useWeb3React()
  const { supplyAmount } = useAppSelector(selectWidgetState)
  const { decimals } = poolUnderlyingToken
  const supplyBigNumber = ethers.utils.parseUnits(
    String(supplyAmount),
    decimals,
  )
  const trancheVaultContract = useTrancheVaultContractV2(
    poolInfo.poolName,
    selectedSupplyType.value as TrancheType,
    provider,
    account,
  )
  const firstLossCoverContract = useFirstLossCoverContractV2(
    poolInfo.poolName,
    selectedSupplyType.value as FirstLossCoverIndex,
    provider,
    account,
  )

  const isTranche = selectedSupplyType.type === 'tranche'
  const isFirstLossCover = selectedSupplyType.type === 'firstLossCover'

  const handleSuccess = useCallback(() => {
    dispatch(setStep(WIDGET_STEP.Done))
  }, [dispatch])

  if (!account) {
    return null
  }
  if (isTranche && !trancheVaultContract) {
    return null
  }
  if (isFirstLossCover && !firstLossCoverContract) {
    return null
  }

  if (isTranche && trancheVaultContract) {
    return (
      <TxSendModalV2
        contract={trancheVaultContract}
        method='deposit'
        params={[supplyBigNumber, account]}
        handleSuccess={handleSuccess}
      />
    )
  }
  if (isFirstLossCover && firstLossCoverContract) {
    return (
      <TxSendModalV2
        contract={firstLossCoverContract}
        method='depositCover'
        params={[supplyBigNumber]}
        handleSuccess={handleSuccess}
      />
    )
  }
  return null
}
