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

  let juniorAssets = liquidityCap.div(defaultMaxSeniorJuniorRatio + 1)
  let seniorAssets = liquidityCap.sub(juniorAssets)
  if (currentMaxSeniorJuniorRatio < defaultMaxSeniorJuniorRatio) {
    juniorAssets = juniorDeployedAssets
    seniorAssets = seniorMaxAssets
  }

  const totalProfit = liquidityCap
    .mul(Math.round(APY * BP_FACTOR_NUMBER))
    .div(BP_FACTOR_NUMBER)
  const postPoolProfitRatio =
    (1 - protocolFeeInBps / BP_FACTOR_NUMBER) *
    (1 -
      rewardRateInBpsForPoolOwner / BP_FACTOR_NUMBER -
      rewardRateInBpsForEA / BP_FACTOR_NUMBER)
  const poolPostProfit = totalProfit
    .mul(Math.round(postPoolProfitRatio * BP_FACTOR_NUMBER))
    .div(BP_FACTOR_NUMBER)
  const blendedApy =
    poolPostProfit.mul(BP_FACTOR_NUMBER).div(liquidityCap).toNumber() /
    BP_FACTOR_NUMBER

  let seniorTrancheApy = 0
  let juniorProfit = BN.from(0)
  if (fixedSeniorYieldInBps > 0) {
    seniorTrancheApy = fixedSeniorYieldInBps / BP_FACTOR_NUMBER
    juniorProfit = poolPostProfit.sub(
      seniorAssets
        .mul(Math.round(seniorTrancheApy * BP_FACTOR_NUMBER))
        .div(BP_FACTOR_NUMBER),
    )
  } else {
    const riskAdjustment = tranchesRiskAdjustmentInBps / BP_FACTOR_NUMBER
    const seniorProfit = seniorAssets
      .mul(
        Math.round(
          postPoolProfitRatio * (1 - riskAdjustment) * APY * BP_FACTOR_NUMBER,
        ),
      )
      .div(BP_FACTOR_NUMBER)
    seniorTrancheApy = postPoolProfitRatio * (1 - riskAdjustment) * APY
    juniorProfit = poolPostProfit.sub(seniorProfit)
  }

  const juniorTrancheApy =
    juniorProfit.mul(BP_FACTOR_NUMBER).div(juniorAssets).toNumber() /
    BP_FACTOR_NUMBER

  return {
    blendedApy,
    seniorTrancheApy,
    juniorTrancheApy,
  }
}
