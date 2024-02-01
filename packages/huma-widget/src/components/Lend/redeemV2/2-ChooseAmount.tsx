import {
  FirstLossCoverIndex,
  getFirstLossCoverContractV2,
  getTrancheVaultContractV2,
  PoolInfoV2,
  UnderlyingTokenInfo,
} from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import { BigNumber, ethers } from 'ethers'
import React, { useEffect, useState } from 'react'

import { ActionType } from '.'
import { useAppDispatch } from '../../../hooks/useRedux'
import {
  setRedeemAmount,
  setRedeemShares,
  setStep,
} from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { InputAmountModal } from '../../InputAmountModal'
import { LoadingModal } from '../../LoadingModal'

type Props = {
  poolInfo: PoolInfoV2
  poolUnderlyingToken: UnderlyingTokenInfo
  selectedActionType: ActionType
}

export function ChooseAmount({
  poolInfo,
  poolUnderlyingToken,
  selectedActionType,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { provider } = useWeb3React()
  const { symbol } = poolUnderlyingToken
  const [sharePrice, setSharePrice] = useState(0)
  const [currentAmount, setCurrentAmount] = useState<number>(0)
  const [currentShares, setCurrentShares] = useState<number>(0)
  const maxAmountFormatted = ethers.utils.formatUnits(
    selectedActionType.availableAmount,
    poolUnderlyingToken.decimals,
  )

  useEffect(() => {
    const fetchData = async () => {
      let shares: BigNumber = BigNumber.from(0)
      if (selectedActionType.type === 'firstLossCover') {
        const firstLossCoverContract = await getFirstLossCoverContractV2(
          poolInfo.poolName,
          Number(selectedActionType.value) as FirstLossCoverIndex,
          provider,
        )
        if (firstLossCoverContract) {
          shares = await firstLossCoverContract.convertToShares(
            selectedActionType.availableAmount,
          )
        }
      } else {
        const vaultContract = await getTrancheVaultContractV2(
          poolInfo.poolName,
          selectedActionType.type,
          provider,
        )
        if (vaultContract) {
          shares = await vaultContract.convertToShares(
            selectedActionType.availableAmount,
          )
        }
      }
      const price = selectedActionType.availableAmount.div(shares)
      setSharePrice(price.toNumber())
    }
    fetchData()
  }, [
    poolInfo.poolName,
    provider,
    selectedActionType.availableAmount,
    selectedActionType.type,
    selectedActionType.value,
  ])

  const handleChangeAmount = (newAmount: number) => {
    const shares = Number(newAmount) / sharePrice
    setCurrentShares(shares)
    setCurrentAmount(Number(newAmount))
    dispatch(setRedeemAmount(Number(newAmount)))
    dispatch(setRedeemShares(shares))
  }

  const handleAction = () => {
    dispatch(setStep(WIDGET_STEP.Transfer))
  }

  if (sharePrice === 0) {
    return <LoadingModal title={`Redeem ${symbol}`} />
  }

  return (
    <InputAmountModal
      title={`Redeem ${symbol}`}
      subTitle={selectedActionType.subTitle}
      tokenSymbol={symbol}
      currentAmount={currentAmount}
      handleChangeAmount={handleChangeAmount}
      maxAmount={maxAmountFormatted}
      info={`${currentShares.toFixed(1)} Shares`}
      handleAction={handleAction}
      actionText='SUBMIT'
    />
  )
}
