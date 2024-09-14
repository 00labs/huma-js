import {
  formatNumber,
  SolanaPoolInfo,
  SolanaTokenUtils,
  timestampToLL,
  TrancheType,
} from '@huma-finance/shared'
import {
  LenderStateAccount,
  SolanaPoolState,
  useTrancheMintAccounts,
  useTrancheTokenAccounts,
} from '@huma-finance/web-shared'
import dayjs from 'dayjs'
import React, { useEffect, useMemo, useState } from 'react'

import { BN } from '@coral-xyz/anchor'
import { useAppDispatch } from '../../../hooks/useRedux'
import {
  setError,
  setRedeemAmount,
  setRedeemShares,
  setStep,
} from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { InputAmountModal } from '../../InputAmountModal'
import { LoadingModal } from '../../LoadingModal'

type Props = {
  poolInfo: SolanaPoolInfo
  poolState: SolanaPoolState
  selectedTranche: TrancheType
  lenderState: LenderStateAccount | null | undefined
}

export function ChooseAmount({
  poolInfo,
  poolState,
  selectedTranche,
  lenderState,
}: Props): React.ReactElement {
  const dispatch = useAppDispatch()
  const { symbol } = poolInfo.underlyingMint
  const [currentAmount, setCurrentAmount] = useState<number>(0)
  const [currentShares, setCurrentShares] = useState<number>(0)
  const { mintAccount, loading: isLoadingTrancheMintAccounts } =
    useTrancheMintAccounts(poolInfo, selectedTranche)
  const {
    seniorTokenAccount,
    juniorTokenAccount,
    loading: isLoadingTokenAccounts,
  } = useTrancheTokenAccounts(poolInfo)

  const maxSharesFormatted = useMemo(() => {
    if (!mintAccount?.decimals) {
      return 0
    }

    return SolanaTokenUtils.formatUnits(
      selectedTranche === 'senior'
        ? new BN(seniorTokenAccount?.amount?.toString() ?? 0)
        : new BN(juniorTokenAccount?.amount?.toString() ?? 0),
      mintAccount.decimals,
    )
  }, [
    mintAccount,
    juniorTokenAccount?.amount,
    selectedTranche,
    seniorTokenAccount?.amount,
  ])

  const sharePrice = useMemo(() => {
    if (!mintAccount?.decimals || !mintAccount?.supply) {
      return 0
    }

    const mintSupplyFormatted = Number(
      SolanaTokenUtils.formatUnits(
        new BN(mintAccount.supply.toString()),
        mintAccount.decimals,
      ),
    )

    if (mintSupplyFormatted === 0) {
      return 0
    }

    const seniorTrancheAssetsFormatted = Number(
      SolanaTokenUtils.formatUnits(
        new BN(poolState?.seniorTrancheAssets ?? 0),
        mintAccount.decimals,
      ),
    )

    if (selectedTranche === 'senior') {
      return seniorTrancheAssetsFormatted / mintSupplyFormatted
    }

    const juniorTrancheAssetsFormatted = Number(
      SolanaTokenUtils.formatUnits(
        new BN(poolState?.juniorTrancheAssets ?? 0),
        mintAccount.decimals,
      ),
    )

    return juniorTrancheAssetsFormatted / mintSupplyFormatted
  }, [
    mintAccount?.decimals,
    mintAccount?.supply,
    poolState?.juniorTrancheAssets,
    poolState?.seniorTrancheAssets,
    selectedTranche,
  ])

  useEffect(() => {
    if (
      poolState?.withdrawalLockupPeriodDays &&
      poolState?.epochEndTime &&
      lenderState
    ) {
      const SECONDS_IN_A_DAY = 24 * 60 * 60
      const lastDepositTime = Number(lenderState.depositRecord.lastDepositTime)
      const lockupEndTime =
        lastDepositTime +
        poolState.withdrawalLockupPeriodDays * SECONDS_IN_A_DAY
      if (poolState.epochEndTime < lockupEndTime) {
        const lockupEndTimeDayjs = dayjs.unix(lockupEndTime).date(1)
        dispatch(setStep(WIDGET_STEP.Error))
        dispatch(
          setError({
            errorReason: 'Redemption too soon',
            errorMessage: `Your last deposit was on ${timestampToLL(
              lastDepositTime,
            )}. You can redeem on ${timestampToLL(lockupEndTimeDayjs.unix())}.`,
          }),
        )
      }
    }
  }, [
    dispatch,
    lenderState,
    poolState.epochEndTime,
    poolState.withdrawalLockupPeriodDays,
  ])

  const handleChangeShares = (newShares: number) => {
    const amount = Number(newShares) * sharePrice
    setCurrentShares(Number(newShares))
    setCurrentAmount(amount)
    dispatch(setRedeemShares(Number(newShares)))
    dispatch(setRedeemAmount(amount))
  }

  const handleAction = () => {
    dispatch(setStep(WIDGET_STEP.Transfer))
  }

  if (
    isLoadingTokenAccounts ||
    isLoadingTrancheMintAccounts ||
    !lenderState ||
    poolState?.withdrawalLockupPeriodDays === undefined || // withdrawalLockupPeriodDays can be 0
    !poolState?.epochEndTime
  ) {
    return <LoadingModal title='Redemption' />
  }

  return (
    <InputAmountModal
      title='Redemption'
      subTitle={`Enter number of shares to redeem from the ${selectedTranche} tranche`}
      tokenSymbol={symbol}
      currentAmount={currentShares}
      handleChangeAmount={handleChangeShares}
      maxAmount={maxSharesFormatted}
      infos={[`${String(formatNumber(currentAmount))} ${symbol}`]}
      maxAmountTitle={`${formatNumber(maxSharesFormatted)} Shares`}
      suffix='Shares'
      handleAction={handleAction}
      actionText='REQUEST'
    />
  )
}
