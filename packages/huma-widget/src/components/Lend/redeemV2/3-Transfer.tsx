import {
  FirstLossCoverIndex,
  getFirstLossCoverContractV2,
  getTrancheVaultContractV2,
  PoolInfoV2,
  TrancheType,
  UnderlyingTokenInfo,
} from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import { BigNumber, ethers } from 'ethers'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { ActionType } from '.'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { TxSendModalV2 } from '../../TxSendModalV2'
import { LoadingModal } from '../../LoadingModal'

type Props = {
  poolInfo: PoolInfoV2
  poolUnderlyingToken: UnderlyingTokenInfo
  selectedActionType: ActionType
}

export function Transfer({
  poolInfo,
  poolUnderlyingToken,
  selectedActionType,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { decimals } = poolUnderlyingToken
  const { account, provider } = useWeb3React()
  const { withdrawAmount } = useAppSelector(selectWidgetState)
  const [contract, setContract] = useState<ethers.Contract | undefined>(
    undefined,
  )
  const withdrawAmountBN = ethers.utils.parseUnits(
    String(withdrawAmount),
    decimals,
  )
  const [withdrawShares, setWithdrawShares] = useState<BigNumber>(
    BigNumber.from(0),
  )

  useEffect(() => {
    const fetchData = async () => {
      if (account) {
        if (selectedActionType.type === 'firstLossCover') {
          const firstLossCoverContract = await getFirstLossCoverContractV2(
            poolInfo.poolName,
            Number(selectedActionType.value) as FirstLossCoverIndex,
            provider,
            account,
          )
          if (firstLossCoverContract) {
            const shares = await firstLossCoverContract.convertToShares(
              withdrawAmountBN,
            )
            setWithdrawShares(shares)
            setContract(firstLossCoverContract)
          }
        } else {
          const trancheVaultContract = await getTrancheVaultContractV2(
            poolInfo.poolName,
            selectedActionType.value as TrancheType,
            provider,
            account,
          )
          if (trancheVaultContract) {
            const shares = await trancheVaultContract.convertToShares(
              withdrawAmountBN,
            )
            setWithdrawShares(shares)
            setContract(trancheVaultContract)
          }
        }
      }
    }
    fetchData()
  }, [
    account,
    poolInfo.poolName,
    provider,
    selectedActionType.type,
    selectedActionType.value,
    withdrawAmountBN,
  ])

  const { method, params } = useMemo(() => {
    if (selectedActionType.action === 'redemption') {
      return {
        method: 'addRedemptionRequest',
        params: [withdrawShares],
      }
    }
    if (selectedActionType.action === 'cancelRedemption') {
      return {
        method: 'cancelRedemptionRequest',
        params: [withdrawShares],
      }
    }
    if (selectedActionType.type === 'firstLossCover') {
      return {
        method: 'redeemCover',
        params: [withdrawShares, account],
      }
    }
    return {
      method: 'disburse',
      params: [],
    }
  }, [
    account,
    selectedActionType.action,
    selectedActionType.type,
    withdrawShares,
  ])

  const handleSuccess = useCallback(() => {
    dispatch(setStep(WIDGET_STEP.Done))
  }, [dispatch])

  if (!account || !contract) {
    return <LoadingModal title='Transaction Pending' />
  }

  return (
    <TxSendModalV2
      contract={contract}
      method={method}
      params={params}
      handleSuccess={handleSuccess}
    />
  )
}
