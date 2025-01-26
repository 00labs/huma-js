import { BN } from '@coral-xyz/anchor'
import {
  formatNumber,
  SolanaPoolInfo,
  SolanaTokenUtils,
  TrancheType,
} from '@huma-finance/shared'
import { SolanaPoolState } from '@huma-finance/web-shared'
import { Account } from '@solana/spl-token'
import React, { useMemo, useState } from 'react'
import { useAppDispatch } from '../../../hooks/useRedux'
import { setStep, setSupplyAmount } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { InputAmountModal } from '../../InputAmountModal'

type Props = {
  poolInfo: SolanaPoolInfo
  poolState: SolanaPoolState
  tokenAccount?: Account
  selectedTranche: TrancheType | undefined
  isUniTranche?: boolean
}

export function ChooseAmount({
  poolInfo,
  poolState,
  tokenAccount,
  selectedTranche,
  isUniTranche,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { symbol, decimals } = poolInfo.underlyingMint
  const [currentAmount, setCurrentAmount] = useState<number | string>(0)
  const balance = tokenAccount
    ? new BN(tokenAccount.amount.toString())
    : new BN(0)

  const { juniorAvailableCapBN, seniorAvailableCapBN } = useMemo(() => {
    const {
      maxSeniorJuniorRatio,
      liquidityCap,
      seniorTrancheAssets,
      juniorTrancheAssets,
    } = poolState
    const juniorTrancheAssetsBN = new BN(juniorTrancheAssets ?? 0)
    const seniorTrancheAssetsBN = new BN(seniorTrancheAssets ?? 0)
    const totalDeployedBN = seniorTrancheAssetsBN.add(juniorTrancheAssetsBN)
    let totalAvailableCapBN = new BN(liquidityCap ?? 0).sub(totalDeployedBN)
    totalAvailableCapBN = totalAvailableCapBN.ltn(0)
      ? new BN(0)
      : totalAvailableCapBN
    const maxSeniorAssetsBN = juniorTrancheAssetsBN.muln(
      maxSeniorJuniorRatio ?? 0,
    )
    let seniorAvailableCapBN = maxSeniorAssetsBN.sub(seniorTrancheAssetsBN)
    seniorAvailableCapBN = seniorAvailableCapBN.gt(totalAvailableCapBN)
      ? totalAvailableCapBN
      : seniorAvailableCapBN

    return {
      juniorAvailableCapBN: totalAvailableCapBN,
      seniorAvailableCapBN,
    }
  }, [poolState])

  const handleChangeAmount = (newAmount: number) => {
    setCurrentAmount(newAmount)
    dispatch(setSupplyAmount(Number(newAmount)))
  }

  const handleAction = () => {
    dispatch(setStep(WIDGET_STEP.ApproveAllowance))
  }

  const getTrancheCap = () => {
    if (selectedTranche === 'junior') {
      return juniorAvailableCapBN
    }
    return seniorAvailableCapBN
  }

  const getMinAmount = (): number => {
    const minAmount = poolState.minDepositAmount
      ? SolanaTokenUtils.formatUnits(
          new BN(poolState.minDepositAmount),
          decimals,
        )
      : 0
    return Math.max(0, Math.ceil(Number(minAmount)))
  }

  const getMaxAmount = (): BN => {
    const trancheCap = getTrancheCap()
    return balance.gt(trancheCap) ? trancheCap : balance
  }

  const getInfos = () => {
    const trancheCap = getTrancheCap()
    const currentAmountBN = SolanaTokenUtils.parseUnits(
      String(currentAmount),
      decimals,
    )
    const remainingCap = trancheCap.sub(currentAmountBN)

    if (remainingCap.ltn(0)) {
      return ['0 remaining capacity']
    }
    return [
      `${formatNumber(
        SolanaTokenUtils.formatUnits(remainingCap, decimals),
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
      maxAmount={Number(SolanaTokenUtils.formatUnits(getMaxAmount(), decimals))}
      maxAmountTitle={`${formatNumber(
        SolanaTokenUtils.formatUnits(balance, decimals),
      )} balance`}
      infos={getInfos()}
      handleAction={handleAction}
      actionText='NEXT'
    />
  )
}
