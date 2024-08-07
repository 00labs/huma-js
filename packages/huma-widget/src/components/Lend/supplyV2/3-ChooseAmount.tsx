import {
  PoolInfoV2,
  TrancheType,
  UnderlyingTokenInfo,
  formatNumber,
} from '@huma-finance/core'
import {
  useLPConfigV2,
  usePoolSafeAllowanceV2,
  usePoolUnderlyingTokenBalanceV2,
} from '@huma-finance/web-core'
import { useWeb3React } from '@web3-react/core'
import { BigNumber, ethers } from 'ethers'
import React, { useState } from 'react'

import { useAppDispatch } from '../../../hooks/useRedux'
import { setStep, setSupplyAmount } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { InputAmountModal } from '../../InputAmountModal'
import { LoadingModal } from '../../LoadingModal'

type Props = {
  poolInfo: PoolInfoV2
  poolUnderlyingToken: UnderlyingTokenInfo
  selectedTranche: TrancheType | undefined
}

export function ChooseAmount({
  poolInfo,
  poolUnderlyingToken,
  selectedTranche,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { account, provider } = useWeb3React()
  const { symbol, decimals } = poolUnderlyingToken
  const [currentAmount, setCurrentAmount] = useState<number | string>(0)
  const { allowance = BigNumber.from(0) } = usePoolSafeAllowanceV2(
    poolInfo.poolName,
    account,
    provider,
  )
  const [balance] = usePoolUnderlyingTokenBalanceV2(
    poolInfo.poolName,
    account,
    provider,
  )
  const maxAmountFormatted = ethers.utils.formatUnits(
    balance,
    poolUnderlyingToken.decimals,
  )
  const lpConfig = useLPConfigV2(poolInfo.poolName, provider)
  const isUniTranche = lpConfig?.maxSeniorJuniorRatio === 0

  const handleChangeAmount = (newAmount: number) => {
    setCurrentAmount(newAmount)
    dispatch(setSupplyAmount(Number(newAmount)))
  }

  const handleAction = () => {
    const currentAmountBN = ethers.utils.parseUnits(
      String(currentAmount),
      decimals,
    )
    const step = currentAmountBN.gt(allowance)
      ? WIDGET_STEP.ApproveAllowance
      : WIDGET_STEP.Transfer
    dispatch(setStep(step))
  }

  if (!lpConfig) {
    return <LoadingModal title='Supply' />
  }

  return (
    <InputAmountModal
      title='Enter Amount'
      subTitle={`Supplying ${symbol} with ${
        isUniTranche ? 'uni tranche' : selectedTranche
      }`}
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
