import { BN } from '@coral-xyz/anchor'

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
): {
  blendedApy: number
  seniorTrancheApy: number
  juniorTrancheApy: number
} => {
  const BP_FACTOR_NUMBER = SOLANA_BP_FACTOR.toNumber()
  const APY = yieldInBps / BP_FACTOR_NUMBER

  const totalDeployedAssets = seniorDeployedAssets.add(juniorDeployedAssets)
  const seniorMaxAssets = liquidityCap
    .sub(totalDeployedAssets)
    .add(seniorDeployedAssets)
  const currentMaxSeniorJuniorRatio = seniorMaxAssets
    .div(juniorDeployedAssets)
    .toNumber()

  let juniorAssets = liquidityCap.div(new BN(defaultMaxSeniorJuniorRatio + 1))
  let seniorAssets = liquidityCap.sub(juniorAssets)
  if (currentMaxSeniorJuniorRatio < defaultMaxSeniorJuniorRatio) {
    juniorAssets = juniorDeployedAssets
    seniorAssets = seniorMaxAssets
  }

  const totalProfit = liquidityCap
    .mul(new BN(Math.round(APY * BP_FACTOR_NUMBER)))
    .div(SOLANA_BP_FACTOR)
  const postPoolProfitRatio =
    (1 - protocolFeeInBps / BP_FACTOR_NUMBER) *
    (1 -
      rewardRateInBpsForPoolOwner / BP_FACTOR_NUMBER -
      rewardRateInBpsForEA / BP_FACTOR_NUMBER)
  const poolPostProfit = totalProfit
    .mul(new BN(Math.round(postPoolProfitRatio * BP_FACTOR_NUMBER)))
    .div(SOLANA_BP_FACTOR)
  const blendedApy =
    poolPostProfit.mul(SOLANA_BP_FACTOR).div(liquidityCap).toNumber() /
    BP_FACTOR_NUMBER

  let seniorTrancheApy = 0
  let juniorProfit = new BN(0)
  if (fixedSeniorYieldInBps > 0) {
    seniorTrancheApy = fixedSeniorYieldInBps / BP_FACTOR_NUMBER
    juniorProfit = poolPostProfit.sub(
      seniorAssets
        .mul(new BN(Math.round(seniorTrancheApy * BP_FACTOR_NUMBER)))
        .div(SOLANA_BP_FACTOR),
    )
  } else {
    const riskAdjustment = tranchesRiskAdjustmentInBps / BP_FACTOR_NUMBER
    const seniorProfit = seniorAssets
      .mul(
        new BN(
          Math.round(
            postPoolProfitRatio * (1 - riskAdjustment) * APY * BP_FACTOR_NUMBER,
          ),
        ),
      )
      .div(SOLANA_BP_FACTOR)
    seniorTrancheApy = postPoolProfitRatio * (1 - riskAdjustment) * APY
    juniorProfit = poolPostProfit.sub(seniorProfit)
  }

  const juniorTrancheApy =
    juniorProfit.mul(SOLANA_BP_FACTOR).div(juniorAssets).toNumber() /
    BP_FACTOR_NUMBER

  return {
    blendedApy,
    seniorTrancheApy,
    juniorTrancheApy,
  }
}

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
