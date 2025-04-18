import { BN } from '@coral-xyz/anchor'

import { Account } from '@solana/spl-token'
import { getPoolApyV2 } from '../../utils/apy'
import { SOLANA_BP_FACTOR } from '../const'

export const getSolanaPoolApy = (
  protocolFeeInBps: number,
  yieldInBps: number,
  rewardRateInBpsForPoolOwner: number,
  rewardRateInBpsForEA: number,
  liquidityCap: BN,
  seniorDeployedAssets: BN,
  juniorDeployedAssets: BN,
  defaultMaxSeniorJuniorRatio: number,
  fixedSeniorYieldInBps: number,
  tranchesRiskAdjustmentInBps: number,
) =>
  getPoolApyV2(
    protocolFeeInBps,
    yieldInBps,
    rewardRateInBpsForPoolOwner,
    rewardRateInBpsForEA,
    liquidityCap.toString(),
    seniorDeployedAssets.toString(),
    juniorDeployedAssets.toString(),
    defaultMaxSeniorJuniorRatio,
    fixedSeniorYieldInBps,
    tranchesRiskAdjustmentInBps,
    SOLANA_BP_FACTOR.toNumber(),
  )

export const getSolanaUtilizationRate = (
  seniorTrancheAssets: BN | undefined,
  juniorTrancheAssets: BN | undefined,
  availableBalance: BN | undefined,
): number | undefined => {
  if (!seniorTrancheAssets || !juniorTrancheAssets || !availableBalance) {
    return undefined
  }

  const totalSupply = seniorTrancheAssets.add(juniorTrancheAssets)
  const borrowedBalance = totalSupply.sub(availableBalance)
  if (borrowedBalance.gt(new BN(0)) && totalSupply.gt(new BN(0))) {
    return (
      borrowedBalance.mul(SOLANA_BP_FACTOR).div(totalSupply).toNumber() /
      SOLANA_BP_FACTOR.toNumber()
    )
  }
  return 0
}

export type PoolStateAccount = {
  accruedIncomes: { protocolIncome: BN; poolOwnerIncome: BN; eaIncome: BN }
  incomeWithdrawn: {
    eaIncomeWithdrawn: BN
    poolOwnerIncomeWithdrawn: BN
    protocolIncomeWithdrawn: BN
  }
  disbursementReserve: BN
  trancheAssets: BN[]
}

export const calculateAvailablePoolBalance = (
  underlyingTokenAccount: Account,
  poolStateAccount: PoolStateAccount,
): BN => {
  const poolTokenBalanceBN = new BN(underlyingTokenAccount.amount.toString())
  const totalAccruedIncomesBN = poolStateAccount.accruedIncomes.protocolIncome
    .add(poolStateAccount.accruedIncomes.poolOwnerIncome)
    .add(poolStateAccount.accruedIncomes.eaIncome)
  const totalIncomeWithdrawnBN =
    poolStateAccount.incomeWithdrawn.protocolIncomeWithdrawn
      .add(poolStateAccount.incomeWithdrawn.poolOwnerIncomeWithdrawn)
      .add(poolStateAccount.incomeWithdrawn.eaIncomeWithdrawn)
  let availableAdminFeesBN = totalAccruedIncomesBN.sub(totalIncomeWithdrawnBN)
  availableAdminFeesBN = availableAdminFeesBN.ltn(0)
    ? new BN(0)
    : availableAdminFeesBN
  return poolTokenBalanceBN
    .sub(poolStateAccount.disbursementReserve)
    .sub(availableAdminFeesBN)
}
