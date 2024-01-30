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
import React, { useCallback, useEffect, useState } from 'react'

import { WithdrawType } from '.'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { setStep } from '../../../store/widgets.reducers'
import { selectWidgetState } from '../../../store/widgets.selectors'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { LoadingModal } from '../../LoadingModal'
import { TxSendModalV2 } from '../../TxSendModalV2'

type Props = {
  poolInfo: PoolInfoV2
  poolUnderlyingToken: UnderlyingTokenInfo
  selectedWithdrawType: WithdrawType
}

export function Transfer({
  poolInfo,
  poolUnderlyingToken,
  selectedWithdrawType,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { account, provider } = useWeb3React()
  const { withdrawAmount } = useAppSelector(selectWidgetState)
  const [firstLossCoverShares, setFirstLossCoverShares] = React.useState<
    BigNumber | undefined
  >(undefined)
  const [contract, setContract] = useState<ethers.Contract | undefined>(
    undefined,
  )

  useEffect(() => {
    const fetchData = async () => {
      if (account) {
        if (selectedWithdrawType.type === 'tranche') {
          const trancheVaultContract = await getTrancheVaultContractV2(
            poolInfo.poolName,
            selectedWithdrawType.value as TrancheType,
            provider,
            account,
          )
          if (trancheVaultContract) {
            setContract(trancheVaultContract)
          }
        }
        if (selectedWithdrawType.type === 'firstLossCover') {
          const firstLossCoverContract = await getFirstLossCoverContractV2(
            poolInfo.poolName,
            Number(selectedWithdrawType.value) as FirstLossCoverIndex,
            provider,
            account,
          )
          if (firstLossCoverContract) {
            const shares = await firstLossCoverContract.convertToShares(
              ethers.utils.parseUnits(
                String(withdrawAmount),
                poolUnderlyingToken.decimals,
              ),
            )
            setFirstLossCoverShares(shares)
            setContract(firstLossCoverContract)
          }
        }
      }
    }
    fetchData()
  }, [
    account,
    poolInfo.poolName,
    poolUnderlyingToken.decimals,
    provider,
    selectedWithdrawType.type,
    selectedWithdrawType.value,
    withdrawAmount,
  ])

  const method =
    selectedWithdrawType.type === 'tranche' ? 'disburse' : 'redeemCover'
  const params =
    selectedWithdrawType.type === 'tranche'
      ? []
      : [firstLossCoverShares, account]

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
