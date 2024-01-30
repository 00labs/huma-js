import {
  FirstLossCoverIndex,
  getFirstLossCoverContractV2,
  PoolInfoV2,
  UnderlyingTokenInfo,
} from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'

import { WithdrawType } from '.'
import { useAppDispatch } from '../../../hooks/useRedux'
import { setStep, setWithdrawAmount } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { InputAmountModal } from '../../InputAmountModal'

type Props = {
  poolInfo: PoolInfoV2
  poolUnderlyingToken: UnderlyingTokenInfo
  selectedWithdrawType: WithdrawType
}

export function ChooseAmount({
  poolInfo,
  poolUnderlyingToken,
  selectedWithdrawType,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { provider } = useWeb3React()
  const { symbol } = poolUnderlyingToken
  const [sharePrice, setSharePrice] = useState(0)
  const [currentAmount, setCurrentAmount] = useState<number>(0)
  const [currentShares, setCurrentShares] = useState<number>(0)
  const maxAmountFormatted = ethers.utils.formatUnits(
    selectedWithdrawType.withdrawableAmount,
    poolUnderlyingToken.decimals,
  )

  useEffect(() => {
    if (selectedWithdrawType.withdrawableAmount.gt(0)) {
      const fetchData = async () => {
        const firstLossCoverContract = await getFirstLossCoverContractV2(
          poolInfo.poolName,
          Number(selectedWithdrawType.value) as FirstLossCoverIndex,
          provider,
        )
        if (firstLossCoverContract) {
          const shares = await firstLossCoverContract.convertToShares(
            selectedWithdrawType.withdrawableAmount,
          )
          const price = selectedWithdrawType.withdrawableAmount.div(shares)
          setSharePrice(price.toNumber())
        }
      }
      fetchData()
    }
  }, [
    poolInfo.poolName,
    provider,
    selectedWithdrawType.value,
    selectedWithdrawType.withdrawableAmount,
  ])

  const handleChangeAmount = (newAmount: number) => {
    const shares = Number(newAmount) / sharePrice
    setCurrentShares(shares)
    setCurrentAmount(newAmount)
    dispatch(setWithdrawAmount(Number(newAmount)))
  }

  const handleAction = () => {
    dispatch(setStep(WIDGET_STEP.Transfer))
  }

  return (
    <InputAmountModal
      title={`Withdraw ${symbol}`}
      subTitle={selectedWithdrawType.label}
      tokenSymbol={symbol}
      currentAmount={currentAmount}
      handleChangeAmount={handleChangeAmount}
      maxAmount={maxAmountFormatted}
      info={`${currentShares.toFixed(1)} Shares`}
      handleAction={handleAction}
      actionText='WITHDRAW'
    />
  )
}
