import {
  formatNumber,
  StellarPoolInfo,
  tokenDecimalUtils,
  TrancheType,
} from '@huma-finance/shared'
import {
  fetchStellarDepositRecord,
  getStellarSharesFromUnderlyingTokenAmount,
  StellarConnectionContext,
  StellarPoolState,
} from '@huma-finance/web-shared'
import React, { useCallback, useContext, useEffect, useState } from 'react'
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
  poolInfo: StellarPoolInfo
  poolState: StellarPoolState
  selectedTranche: TrancheType
}

export function ChooseAmount({
  poolInfo,
  poolState,
  selectedTranche,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { address: stellarAddress } = useContext(StellarConnectionContext)
  const [currentAmount, setCurrentAmount] = useState<number | string>(0)
  const [principal, setPrincipal] = useState<bigint | null>(null)
  const [isLoadingDepositRecord, setIsLoadingDepositRecord] = useState(true)

  const { symbol, decimals: underlyingDecimals } = poolInfo.underlyingToken
  const { trancheDecimals } = poolInfo

  const totalAssets = BigInt(
    selectedTranche === 'senior'
      ? poolState.seniorTrancheAssets ?? 0
      : poolState.juniorTrancheAssets ?? 0,
  )
  const totalSupply = BigInt(
    selectedTranche === 'senior'
      ? poolState.seniorTrancheTokenSupply ?? 0
      : poolState.juniorTrancheTokenSupply ?? 0,
  )

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!stellarAddress) {
        setIsLoadingDepositRecord(false)
        return
      }
      setIsLoadingDepositRecord(true)
      try {
        const record = await fetchStellarDepositRecord(
          poolInfo,
          selectedTranche,
          stellarAddress,
        )
        if (!cancelled) {
          setPrincipal(record?.principal ?? 0n)
        }
      } finally {
        if (!cancelled) {
          setIsLoadingDepositRecord(false)
        }
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [poolInfo, selectedTranche, stellarAddress])

  const maxUnderlyingFormatted = useCallback(() => {
    if (principal == null) return 0
    return Number(tokenDecimalUtils.formatUnits(principal, underlyingDecimals))
  }, [principal, underlyingDecimals])

  const handleChangeAmount = useCallback(
    (amount: number) => {
      setCurrentAmount(amount)
      dispatch(setRedeemAmount(amount))
      if (amount <= 0 || totalAssets <= 0n) {
        dispatch(setRedeemShares(0))
        return
      }
      const underlyingRaw = tokenDecimalUtils.parseUnits(
        String(amount),
        underlyingDecimals,
      )
      const sharesRaw = getStellarSharesFromUnderlyingTokenAmount(
        underlyingRaw,
        totalAssets,
        totalSupply,
      )
      const sharesFormatted = Number(
        tokenDecimalUtils.formatUnits(sharesRaw, trancheDecimals),
      )
      dispatch(setRedeemShares(sharesFormatted))
    },
    [dispatch, underlyingDecimals, trancheDecimals, totalAssets, totalSupply],
  )

  const handleAction = useCallback(() => {
    dispatch(setStep(WIDGET_STEP.Transfer))
  }, [dispatch])

  if (isLoadingDepositRecord) {
    return <LoadingModal title='Redemption' />
  }

  const maxUnderlying = maxUnderlyingFormatted()

  return (
    <InputAmountModal
      title='Redemption'
      subTitle={`Enter amount of ${symbol} to withdraw from the ${selectedTranche} tranche`}
      tokenSymbol={symbol}
      currentAmount={currentAmount}
      handleChangeAmount={handleChangeAmount}
      maxAmount={maxUnderlying}
      maxAmountTitle={`${formatNumber(maxUnderlying)} ${symbol} requestable`}
      handleAction={handleAction}
      actionText='REQUEST'
    />
  )
}
