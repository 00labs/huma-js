import { BigNumber } from 'ethers'

import { FirstLossCoverIndex } from '../types'
import { BP_FACTOR } from './const'

const getFlcTotalAssetsAfterRisk = (
  flcConfigs: {
    minLiquidity: BigNumber
    riskYieldMultiplierInBps: number
  }[],
): BigNumber => {
  const flcTotalAssetsAfterRisk = flcConfigs.reduce(
    (acc, flcConfig) =>
      acc.add(
        flcConfig.minLiquidity
          .mul(flcConfig.riskYieldMultiplierInBps)
          .div(BP_FACTOR),
      ),
    BigNumber.from(0),
  )
  return flcTotalAssetsAfterRisk
}

// Please refer to: https://docs.google.com/spreadsheets/d/1Pkqj7pcJ6OxFG8ZTYQLAeAKf3ouD0mAzT9AKoH1ym4s/edit#gid=0 for APY formula
export const getPoolOverviewV2 = (
  protocolFeeInBps: number,
  yieldInBps: number,
  rewardRateInBpsForPoolOwner: number,
  rewardRateInBpsForEA: number,
  liquidityCap: BigNumber,
  maxSeniorJuniorRatio: number,
  fixedSeniorYieldInBps: number,
  tranchesRiskAdjustmentInBps: number,
  flcConfigs: {
    minLiquidity: BigNumber
    riskYieldMultiplierInBps: number
    flcIndex: number
    maxLiquidity: BigNumber
  }[],
): {
  flcConfigsWithApy: {
    firstLossCoverIndex: number
    maxLiquidity: BigNumber
    minLiquidity: BigNumber
    riskYieldMultiplierInBps: number
    apy: number
  }[]
  blendedApy: number
  seniorTrancheApy: number
  juniorTrancheApy: number
} => {
  const BP_FACTOR_NUMBER = BP_FACTOR.toNumber()
  // APY = (1+APR/12)^12 - 1
  const APY = (1 + yieldInBps / BP_FACTOR_NUMBER / 12) ** 12 - 1

  const juniorAssets = liquidityCap.div(maxSeniorJuniorRatio + 1)
  const seniorAssets = liquidityCap.sub(juniorAssets)

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
  let seniorPostProfit = BigNumber.from(0)
  if (fixedSeniorYieldInBps > 0) {
    seniorTrancheApy = fixedSeniorYieldInBps / BP_FACTOR_NUMBER
    seniorPostProfit = poolPostProfit.sub(
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
    seniorPostProfit = poolPostProfit.sub(seniorProfit)
  }

  const flcTotalAssetsAfterRisk = getFlcTotalAssetsAfterRisk(flcConfigs)
  const weight = juniorAssets.add(flcTotalAssetsAfterRisk)

  const juniorProfit = juniorAssets.mul(seniorPostProfit).div(weight)
  const juniorTrancheApy =
    juniorProfit.mul(BP_FACTOR_NUMBER).div(juniorAssets).toNumber() /
    BP_FACTOR_NUMBER
  const flcTotalProfit = flcTotalAssetsAfterRisk
    .mul(seniorPostProfit)
    .div(weight)
  const flcConfigsWithApy = flcConfigs.map((flcConfig) => {
    const flcAssetsAfterRisk = flcConfig.minLiquidity
      .mul(flcConfig.riskYieldMultiplierInBps)
      .div(BP_FACTOR)

    let apy = 0
    if (flcConfig.minLiquidity.gt(0) && flcAssetsAfterRisk.gt(0)) {
      const flcProfit = flcAssetsAfterRisk
        .mul(flcTotalProfit)
        .div(flcTotalAssetsAfterRisk)
      apy =
        flcProfit.mul(BP_FACTOR_NUMBER).div(flcConfig.minLiquidity).toNumber() /
        BP_FACTOR_NUMBER
    }

    return {
      firstLossCoverIndex: Number(
        Object.keys(FirstLossCoverIndex)[flcConfig.flcIndex],
      ),
      maxLiquidity: flcConfig.maxLiquidity,
      minLiquidity: flcConfig.minLiquidity,
      riskYieldMultiplierInBps: flcConfig.riskYieldMultiplierInBps,
      apy,
    }
  })

  return {
    flcConfigsWithApy,
    blendedApy,
    seniorTrancheApy,
    juniorTrancheApy,
  }
}
