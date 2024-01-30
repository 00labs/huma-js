import {
  FirstLossCoverIndex,
  getFirstLossCoverContractV2,
  getTrancheVaultContractV2,
  PoolInfoV2,
  TrancheType,
  UnderlyingTokenInfo,
} from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import React, { useCallback, useEffect, useState } from 'react'

import { SupplyType } from '.'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { LoadingModal } from '../../LoadingModal'
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
}: Props): React.ReactElement {
  const dispatch = useAppDispatch()
  const { account, provider } = useWeb3React()
  const { supplyAmount } = useAppSelector(selectWidgetState)
  const { decimals } = poolUnderlyingToken
  const supplyBigNumber = ethers.utils.parseUnits(
    String(supplyAmount),
    decimals,
  )
  const [contract, setContract] = useState<ethers.Contract | undefined>(
    undefined,
  )

  useEffect(() => {
    const fetchData = async () => {
      if (account) {
        if (selectedSupplyType.type === 'tranche') {
          const trancheVaultContract = await getTrancheVaultContractV2(
            poolInfo.poolName,
            selectedSupplyType.value as TrancheType,
            provider,
            account,
          )
          if (trancheVaultContract) {
            setContract(trancheVaultContract)
          }
        }
        if (selectedSupplyType.type === 'firstLossCover') {
          const firstLossCoverContract = await getFirstLossCoverContractV2(
            poolInfo.poolName,
            Number(selectedSupplyType.value) as FirstLossCoverIndex,
            provider,
            account,
          )
          if (firstLossCoverContract) {
            setContract(firstLossCoverContract)
          }
        }
      }
    }
    fetchData()
  }, [
    account,
    poolInfo.poolName,
    provider,
    selectedSupplyType.type,
    selectedSupplyType.value,
  ])

  const method =
    selectedSupplyType.type === 'tranche' ? 'deposit' : 'depositCover'
  const params =
    selectedSupplyType.type === 'tranche'
      ? [supplyBigNumber, account]
      : [supplyBigNumber]

  const handleSuccess = useCallback(() => {
    dispatch(setStep(WIDGET_STEP.Done))
  }, [dispatch])

  if (!contract) {
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
