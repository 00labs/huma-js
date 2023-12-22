import {
  CreditStatsV2,
  PoolInfoV2,
  UnderlyingTokenInfo,
  usePoolSafeAllowanceV2,
} from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import React, { useCallback, useState } from 'react'

import { useAppDispatch } from '../../../hooks/useRedux'
import { setBorrowInfo } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ChooseAmountModal } from '../../ChooseAmountModal'
import { LoadingModal } from '../../LoadingModal'

type Props = {
  poolInfo: PoolInfoV2
  poolUnderlyingToken: UnderlyingTokenInfo
  accountStats: CreditStatsV2
}

export function ChooseAmount({
  poolInfo,
  poolUnderlyingToken,
  accountStats,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { account, provider } = useWeb3React()
  const { symbol, decimals } = poolUnderlyingToken!
  const [currentAmount, setCurrentAmount] = useState(0)
  const { creditAvailable } = accountStats
  const creditAvailableFormatted = creditAvailable
    ? Number(ethers.utils.formatUnits(creditAvailable, decimals))
    : 0

  const { autopayEnabled } = usePoolSafeAllowanceV2(
    poolInfo.poolName,
    account,
    provider,
  )
  const handleChangeAmount = useCallback((newAmount: number) => {
    setCurrentAmount(newAmount)
  }, [])

  const handleAction = useCallback(() => {
    const nextStep = autopayEnabled
      ? WIDGET_STEP.MintNFT
      : WIDGET_STEP.ApproveAllowance

    dispatch(
      setBorrowInfo({
        borrowAmount: currentAmount,
        borrowAmountBN: ethers.utils
          .parseUnits(currentAmount.toString(), decimals)
          .toJSON(),
        chargedFees: 0,
        nextStep,
      }),
    )
  }, [autopayEnabled, currentAmount, decimals, dispatch])

  if (autopayEnabled === undefined) {
    return <LoadingModal title='Borrow' />
  }

  return (
    <ChooseAmountModal
      title='Borrow'
      description1='Choose Amount'
      sliderMax={creditAvailableFormatted}
      currentAmount={currentAmount}
      tokenSymbol={symbol}
      handleChangeAmount={handleChangeAmount}
      handleAction={handleAction}
      actionText='Borrow'
    />
  )
}
