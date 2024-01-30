import {
  FirstLossCoverIndex,
  formatNumber,
  PoolInfoV2,
  UnderlyingTokenInfo,
  useFirstLossCoverAllowanceV2,
  usePoolSafeAllowanceV2,
  usePoolUnderlyingTokenBalanceV2,
} from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import { BigNumber, ethers } from 'ethers'
import React, { useState } from 'react'

import { SupplyType } from '.'
import { useAppDispatch } from '../../../hooks/useRedux'
import { setStep, setSupplyAmount } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { InputAmountModal } from '../../InputAmountModal'

type Props = {
  poolInfo: PoolInfoV2
  poolUnderlyingToken: UnderlyingTokenInfo
  selectedSupplyType: SupplyType
}

export function ChooseAmount({
  poolInfo,
  poolUnderlyingToken,
  selectedSupplyType,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { account, provider } = useWeb3React()
  const { symbol, decimals } = poolUnderlyingToken
  const [currentAmount, setCurrentAmount] = useState<number | string>(0)
  const { allowance: poolSafeAllowance = BigNumber.from(0) } =
    usePoolSafeAllowanceV2(poolInfo.poolName, account, provider)
  const [firstLossCoverAllowance = BigNumber.from(0)] =
    useFirstLossCoverAllowanceV2(
      poolInfo.poolName,
      Number(selectedSupplyType.value) as FirstLossCoverIndex,
      account,
      provider,
    )
  const [underlyingTokenBalance = BigNumber.from(0)] =
    usePoolUnderlyingTokenBalanceV2(poolInfo.poolName, account, provider)
  const maxAmountFormatted = ethers.utils.formatUnits(
    underlyingTokenBalance,
    poolUnderlyingToken.decimals,
  )

  const handleChangeAmount = (newAmount: number) => {
    setCurrentAmount(newAmount)
    dispatch(setSupplyAmount(Number(newAmount)))
  }

  const handleAction = () => {
    const currentAmountBN = ethers.utils.parseUnits(
      String(currentAmount),
      decimals,
    )
    if (selectedSupplyType.type === 'tranche') {
      const step = currentAmountBN.gt(poolSafeAllowance)
        ? WIDGET_STEP.ApproveAllowance
        : WIDGET_STEP.Transfer
      dispatch(setStep(step))
    } else {
      const step = currentAmountBN.gt(firstLossCoverAllowance)
        ? WIDGET_STEP.ApproveAllowance
        : WIDGET_STEP.Transfer
      dispatch(setStep(step))
    }
  }

  return (
    <InputAmountModal
      title='Enter Amount'
      subTitle={`Supplying ${symbol} with ${selectedSupplyType?.label}`}
      tokenSymbol={symbol}
      currentAmount={currentAmount}
      handleChangeAmount={handleChangeAmount}
      maxAmount={maxAmountFormatted}
      info={`${formatNumber(maxAmountFormatted)} Available`}
      handleAction={handleAction}
      actionText='SUPPLY'
    />
  )
}
