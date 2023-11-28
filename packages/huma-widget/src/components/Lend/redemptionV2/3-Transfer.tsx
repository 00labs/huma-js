import {
  PoolInfoV2,
  UnderlyingTokenInfo,
  useTrancheVaultContractV2,
} from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import React, { useCallback } from 'react'

import { ethers } from 'ethers'
import { REDEMPTION_TYPE, RedemptionActionInfo } from '.'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { TxSendModalV2 } from '../../TxSendModalV2'

type Props = {
  poolInfo: PoolInfoV2
  poolUnderlyingToken: UnderlyingTokenInfo
  redemptionType: REDEMPTION_TYPE
}

export function Transfer({
  poolInfo,
  poolUnderlyingToken,
  redemptionType,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { decimals } = poolUnderlyingToken
  const { account, provider } = useWeb3React()
  const { redeemShares } = useAppSelector(selectWidgetState)
  const redemptionActionInfo = RedemptionActionInfo[redemptionType]
  const trancheVaultContract = useTrancheVaultContractV2(
    poolInfo.poolName,
    redemptionActionInfo.tranche,
    provider,
    account,
  )
  const redeemSharesBN = ethers.utils.parseUnits(String(redeemShares), decimals)

  const handleSuccess = useCallback(() => {
    dispatch(setStep(WIDGET_STEP.Done))
  }, [dispatch])

  if (!trancheVaultContract || !account) {
    return null
  }

  return (
    <TxSendModalV2
      contract={trancheVaultContract}
      method={`${redemptionActionInfo.action.toLowerCase()}RedemptionRequest`}
      params={[redeemSharesBN]}
      handleSuccess={handleSuccess}
    />
  )
}
