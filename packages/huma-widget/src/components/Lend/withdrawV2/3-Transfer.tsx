import {
  PoolInfoV2,
  TrancheType,
  UnderlyingTokenInfo,
  getTrancheToSharesV2,
  toBigNumber,
  upScale,
  useTrancheVaultContractV2,
} from '@huma-finance/shared'
import React, { useCallback } from 'react'

import { useWeb3React } from '@web3-react/core'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { TxSendModalV2 } from '../../TxSendModalV2'

type Props = {
  poolInfo: PoolInfoV2
  poolUnderlyingToken: UnderlyingTokenInfo
  selectedTranche: TrancheType | undefined
}

export function Transfer({
  poolInfo,
  poolUnderlyingToken,
  selectedTranche,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { decimals } = poolUnderlyingToken
  const { account, provider } = useWeb3React()
  const { withdrawAmount } = useAppSelector(selectWidgetState)
  const trancheVaultContract = useTrancheVaultContractV2(
    poolInfo.poolName,
    selectedTranche!,
    provider,
    account,
  )
  const withdrawBigNumber = toBigNumber(upScale(withdrawAmount!, decimals))
  const withdrawShares = getTrancheToSharesV2(
    poolInfo.poolName,
    selectedTranche!,
    provider,
    withdrawBigNumber,
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
      method='addRedemptionRequest'
      params={[withdrawShares]}
      handleSuccess={handleSuccess}
    />
  )
}
