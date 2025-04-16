import {
  CampaignService,
  NETWORK_TYPE,
  PoolInfoV2,
  TrancheType,
} from '@huma-finance/shared'
import { checkIsDev, useTrancheVaultContractV2 } from '@huma-finance/web-shared'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import React, { useCallback } from 'react'

import { Campaign } from '.'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { setPointsAccumulated, setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { TxSendModalV2 } from '../../TxSendModalV2'

type Props = {
  poolInfo: PoolInfoV2
  trancheType: TrancheType
  networkType: NETWORK_TYPE
  campaign?: Campaign
}

export function Transfer({
  poolInfo,
  trancheType,
  networkType,
  campaign,
}: Props): React.ReactElement | null {
  const isDev = checkIsDev()
  const dispatch = useAppDispatch()
  const { account, chainId, provider } = useWeb3React()
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

  const handleSuccess = useCallback(
    async (options?: { txHash: string }) => {
      if (campaign && options?.txHash) {
        try {
          const result = await CampaignService.updateHumaAccountPoints(
            account!,
            options.txHash,
            chainId!,
            networkType,
            isDev,
          )
          dispatch(setPointsAccumulated(result.pointsAccumulated))
        } catch (error) {
          console.error('Failed to update wallet Feathers', error)
        }
      }
      dispatch(setStep(WIDGET_STEP.Done))
    },
    [account, campaign, chainId, dispatch, isDev, networkType],
  )

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
