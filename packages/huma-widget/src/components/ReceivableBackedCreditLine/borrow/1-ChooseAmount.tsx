import {
  CreditStatsV2,
  PoolInfoV2,
  UnderlyingTokenInfo,
  usePoolSafeAllowanceV2,
  useReceivableInfoV2,
} from '@huma-finance/shared'
import { useWeb3React } from '@web3-react/core'
import { BigNumber, ethers } from 'ethers'
import React, { useCallback, useEffect, useState } from 'react'

import { useAppDispatch } from '../../../hooks/useRedux'
import { setBorrowInfo } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { ChooseAmountModal } from '../../ChooseAmountModal'
import { LoadingModal } from '../../LoadingModal'

type Props = {
  poolInfo: PoolInfoV2
  poolUnderlyingToken: UnderlyingTokenInfo
  accountStats: CreditStatsV2
  tokenId: string
}

export function ChooseAmount({
  poolInfo,
  poolUnderlyingToken,
  accountStats,
  tokenId,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { account, provider } = useWeb3React()
  const { symbol, decimals } = poolUnderlyingToken!
  const [currentAmount, setCurrentAmount] = useState(0)
  const { creditAvailable } = accountStats
  const receivableInfo = useReceivableInfoV2(
    poolInfo.poolName,
    tokenId,
    provider,
  )
  const { autopayEnabled } = usePoolSafeAllowanceV2(
    poolInfo.poolName,
    account,
    provider,
  )
  const [maxAmount, setMaxAmount] = useState(0)

  useEffect(() => {
    if (creditAvailable) {
      let maxAmountBN: BigNumber = creditAvailable

      if (receivableInfo) {
        const receivableAmountBN = BigNumber.from(
          receivableInfo.receivableAmount,
        )
        maxAmountBN = receivableAmountBN.lte(creditAvailable)
          ? receivableAmountBN
          : creditAvailable
      }
      setMaxAmount(Number(ethers.utils.formatUnits(maxAmountBN, decimals)))
    }
  }, [creditAvailable, decimals, receivableInfo])

  const handleChangeAmount = useCallback((newAmount: number) => {
    setCurrentAmount(newAmount)
  }, [])

  const handleAction = useCallback(() => {
    const nextStep = autopayEnabled
      ? WIDGET_STEP.ApproveNFT
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

  if (autopayEnabled === undefined || (tokenId && !receivableInfo)) {
    return <LoadingModal title='Borrow' />
  }

  return (
    <ChooseAmountModal
      title='Borrow'
      description1='Choose Amount'
      sliderMax={maxAmount}
      currentAmount={currentAmount}
      tokenSymbol={symbol}
      handleChangeAmount={handleChangeAmount}
      handleAction={handleAction}
      actionText='Borrow'
    />
  )
}
