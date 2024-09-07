import {
  formatNumber,
  SolanaPoolInfo,
  SolanaTokenUtils,
  TrancheType,
} from '@huma-finance/shared'
import { SolanaPoolState } from '@huma-finance/web-shared'
import React, { useMemo, useState } from 'react'
import { BN } from '@coral-xyz/anchor'
import { Account } from '@solana/spl-token'
import { useAppDispatch } from '../../../hooks/useRedux'
import { setStep, setSupplyAmount } from '../../../store/widgets.reducers'
import { WIDGET_STEP } from '../../../store/widgets.store'
import { InputAmountModal } from '../../InputAmountModal'

type Props = {
  poolInfo: SolanaPoolInfo
  poolState: SolanaPoolState
  tokenAccount: Account
  selectedTranche: TrancheType | undefined
  isUniTranche: boolean
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
  const balance = useMemo(
    () => new BN(tokenAccount.amount),
    [tokenAccount.amount],
  )

  const { juniorAvailableCapBN, seniorAvailableCapBN } = useMemo(() => {
    const {
      maxSeniorJuniorRatio,
      liquidityCap,
      seniorTrancheAssets,
      juniorTrancheAssets,
    } = poolState
    const juniorTrancheAssetsBN = new BN(juniorTrancheAssets)
    const seniorTrancheAssetsBN = new BN(seniorTrancheAssets)
    const totalDeployedBN = seniorTrancheAssetsBN.add(juniorTrancheAssetsBN)
    const totalAvailableCapBN = new BN(liquidityCap).sub(totalDeployedBN)
    const maxSeniorAssetsBN = juniorTrancheAssetsBN.muln(maxSeniorJuniorRatio)
    let seniorAvailableCapBN = maxSeniorAssetsBN.sub(seniorTrancheAssetsBN)
    seniorAvailableCapBN = seniorAvailableCapBN.gt(totalAvailableCapBN)
      ? totalAvailableCapBN
      : seniorAvailableCapBN

    return {
      juniorAvailableCapBN: totalAvailableCapBN.sub(seniorAvailableCapBN),
      seniorAvailableCapBN,
    }
  }, [poolState])

  const handleChangeAmount = (newAmount: number) => {
    setCurrentAmount(newAmount)
    dispatch(setSupplyAmount(Number(newAmount)))
  }

  const handleAction = () => {
    // const currentAmountBN = SolanaTokenUtils.parseUnits(
    //   String(currentAmount),
    //   decimals,
    // )
    // const step =
    //   currentAmountBN.gt(delegatedAmount) ||
    //   tokenAccount.delegate?.toString() !== sentinel
    //     ? WIDGET_STEP.ApproveAllowance
    //     : WIDGET_STEP.Transfer
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
        isUniTranche ? 'uni tranche' : selectedTranche
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
      actionText='SUPPLY'
    />
  )
}
