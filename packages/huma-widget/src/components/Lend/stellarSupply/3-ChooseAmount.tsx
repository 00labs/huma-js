import {
  formatNumber,
  StellarPoolInfo,
  tokenDecimalUtils,
  TrancheType,
} from '@huma-finance/shared'
import { StellarPoolState } from '@huma-finance/web-shared'
import React, { useMemo, useState } from 'react'
import { useAppDispatch } from '../../../hooks/useRedux'
import { setStep, setSupplyAmount } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { InputAmountModal } from '../../InputAmountModal'

type Props = {
  poolInfo: StellarPoolInfo
  poolState: StellarPoolState
  tokenBalance: number | null
  selectedTranche: TrancheType | undefined
  isUniTranche?: boolean
}

export function ChooseAmount({
  poolInfo,
  poolState,
  tokenBalance,
  selectedTranche,
  isUniTranche,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { symbol, decimals } = poolInfo.underlyingToken
  const [currentAmount, setCurrentAmount] = useState<number | string>(0)
  const balance = tokenBalance ? BigInt(tokenBalance) : BigInt(0)

  const { juniorAvailableCapBN, seniorAvailableCapBN } = useMemo(() => {
    const {
      maxSeniorJuniorRatio,
      liquidityCap,
      seniorTrancheAssets,
      juniorTrancheAssets,
    } = poolState
    const juniorTrancheAssetsBN = BigInt(juniorTrancheAssets ?? 0)
    const seniorTrancheAssetsBN = BigInt(seniorTrancheAssets ?? 0)
    const totalDeployedBN = seniorTrancheAssetsBN + juniorTrancheAssetsBN
    let totalAvailableCapBN = BigInt(liquidityCap ?? 0) - totalDeployedBN
    totalAvailableCapBN =
      totalAvailableCapBN < 0 ? BigInt(0) : totalAvailableCapBN
    const maxSeniorAssetsBN =
      juniorTrancheAssetsBN * BigInt(maxSeniorJuniorRatio ?? 0)
    let seniorAvailableCapBN = maxSeniorAssetsBN - seniorTrancheAssetsBN
    seniorAvailableCapBN =
      seniorAvailableCapBN > totalAvailableCapBN
        ? totalAvailableCapBN
        : seniorAvailableCapBN

    return {
      juniorAvailableCapBN: totalAvailableCapBN - seniorAvailableCapBN,
      seniorAvailableCapBN,
    }
  }, [poolState])

  const handleChangeAmount = (newAmount: number) => {
    setCurrentAmount(newAmount)
    dispatch(setSupplyAmount(Number(newAmount)))
  }

  const handleAction = () => {
    dispatch(setStep(WIDGET_STEP.Transfer))
  }

  const getTrancheCap = () => {
    if (selectedTranche === 'junior') {
      return juniorAvailableCapBN
    }
    return seniorAvailableCapBN
  }

  const getMinAmount = (): number => {
    const minAmount = poolState.minDepositAmount
      ? tokenDecimalUtils.formatUnits(
          BigInt(poolState.minDepositAmount),
          decimals,
        )
      : 0
    return Math.max(0, Math.ceil(Number(minAmount)))
  }

  const getMaxAmount = (): bigint => {
    const trancheCap = getTrancheCap()
    return balance > trancheCap ? trancheCap : balance
  }

  const getInfos = () => {
    const trancheCap = getTrancheCap()
    const currentAmountBN = tokenDecimalUtils.parseUnits(
      String(currentAmount),
      decimals,
    )
    const remainingCap = trancheCap - currentAmountBN

    if (remainingCap <= BigInt(0)) {
      return ['0 remaining capacity']
    }
    return [
      `${formatNumber(
        tokenDecimalUtils.formatUnits(remainingCap, decimals),
      )} remaining capacity`,
    ]
  }

  return (
    <InputAmountModal
      title='Enter Amount'
      subTitle={`Depositing to ${
        isUniTranche ? 'uni' : selectedTranche
      } tranche`}
      tokenSymbol={symbol}
      currentAmount={currentAmount}
      handleChangeAmount={handleChangeAmount}
      minimumAmount={getMinAmount()}
      maxAmount={Number(
        tokenDecimalUtils.formatUnits(getMaxAmount(), decimals),
      )}
      maxAmountTitle={`${formatNumber(
        tokenDecimalUtils.formatUnits(balance, decimals),
      )} balance`}
      infos={getInfos()}
      handleAction={handleAction}
      actionText='SUPPLY'
    />
  )
}
