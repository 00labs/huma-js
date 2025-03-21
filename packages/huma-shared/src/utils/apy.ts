import { BigNumber } from 'ethers'

export interface FlcConfig {
  minLiquidity: string
  riskYieldMultiplierInBps: number
  flcIndex: number
  maxLiquidity: string
}

export interface FlcConfigWithApy extends FlcConfig {
  apy: number
  firstLossCoverIndex: number
}

export interface PoolApy {
  flcConfigsWithApy: FlcConfigWithApy[]
  blendedApy: number
  seniorTrancheApy: number
  juniorTrancheApy: number
}

const getFlcTotalAssetsAfterRisk = (
  flcConfigs: {
    minLiquidity: string
    riskYieldMultiplierInBps: number
  }[],
  BP_FACTOR: number,
): BigNumber => {
  const flcTotalAssetsAfterRisk = flcConfigs.reduce(
    (acc, flcConfig) =>
      acc.add(
        BigNumber.from(flcConfig.minLiquidity)
          .mul(flcConfig.riskYieldMultiplierInBps)
          .div(BP_FACTOR),
      ),
    BigNumber.from(0),
  )
  return flcTotalAssetsAfterRisk
}

const getPoolApyV2Base = (
  protocolFeeInBps: number,
  yieldInBps: number,
  rewardRateInBpsForPoolOwner: number,
  rewardRateInBpsForEA: number,
  liquidityCap: string,
  seniorDeployedAssets: string,
  juniorDeployedAssets: string,
  maxSeniorJuniorRatio: number,
  fixedSeniorYieldInBps: number,
  tranchesRiskAdjustmentInBps: number,
  BP_FACTOR: number,
  FirstLossCoverIndexes: string[] = [],
  flcConfigs: FlcConfig[] = [],
): PoolApy => {
  const APY = yieldInBps / BP_FACTOR

  let liquidityCapBN = BigNumber.from(liquidityCap)
  const seniorDeployedAssetsBN = BigNumber.from(seniorDeployedAssets)
  const juniorDeployedAssetsBN = BigNumber.from(juniorDeployedAssets)
  const totalDeployedAssetsBN = seniorDeployedAssetsBN.add(
    juniorDeployedAssetsBN,
  )
  if (totalDeployedAssetsBN.eq(0)) {
    return {
      flcConfigsWithApy: [],
      blendedApy: 0,
      seniorTrancheApy: 0,
      juniorTrancheApy: 0,
    }
  }
  if (liquidityCapBN.eq(0)) {
    liquidityCapBN = totalDeployedAssetsBN
  }
  const seniorMaxAssetsBN = liquidityCapBN
    .sub(totalDeployedAssetsBN)
    .add(seniorDeployedAssetsBN)
  const currentMaxSeniorJuniorRatio = seniorMaxAssetsBN
    .div(juniorDeployedAssetsBN)
    .toNumber()

  let juniorAssetsBN = liquidityCapBN.div(maxSeniorJuniorRatio + 1)
  let seniorAssetsBN = liquidityCapBN.sub(juniorAssetsBN)
  if (currentMaxSeniorJuniorRatio < maxSeniorJuniorRatio) {
    juniorAssetsBN = juniorDeployedAssetsBN
    seniorAssetsBN = seniorMaxAssetsBN
  }

  const totalProfitBN = liquidityCapBN
    .mul(Math.round(APY * BP_FACTOR))
    .div(BP_FACTOR)
  const postPoolProfitRatio =
    (1 - protocolFeeInBps / BP_FACTOR) *
    (1 -
      rewardRateInBpsForPoolOwner / BP_FACTOR -
      rewardRateInBpsForEA / BP_FACTOR)
  const poolPostProfitBN = totalProfitBN
    .mul(Math.round(postPoolProfitRatio * BP_FACTOR))
    .div(BP_FACTOR)
  const blendedApy =
    poolPostProfitBN.mul(BP_FACTOR).div(liquidityCapBN).toNumber() / BP_FACTOR

  let seniorTrancheApy = 0
  let seniorPostProfitBN = BigNumber.from(0)
  if (fixedSeniorYieldInBps > 0) {
    seniorTrancheApy = fixedSeniorYieldInBps / BP_FACTOR
    seniorPostProfitBN = poolPostProfitBN.sub(
      seniorAssetsBN
        .mul(Math.round(seniorTrancheApy * BP_FACTOR))
        .div(BP_FACTOR),
    )
  } else {
    const riskAdjustment = tranchesRiskAdjustmentInBps / BP_FACTOR
    const seniorProfitBN = seniorAssetsBN
      .mul(
        Math.round(
          postPoolProfitRatio * (1 - riskAdjustment) * APY * BP_FACTOR,
        ),
      )
      .div(BP_FACTOR)
    seniorTrancheApy = postPoolProfitRatio * (1 - riskAdjustment) * APY
    seniorPostProfitBN = poolPostProfitBN.sub(seniorProfitBN)
  }

  const flcTotalAssetsAfterRiskBN = getFlcTotalAssetsAfterRisk(
    flcConfigs,
    BP_FACTOR,
  )
  const weightBN = juniorAssetsBN.add(flcTotalAssetsAfterRiskBN)

  const juniorProfitBN = juniorAssetsBN.mul(seniorPostProfitBN).div(weightBN)
  const juniorTrancheApy =
    juniorProfitBN.mul(BP_FACTOR).div(juniorAssetsBN).toNumber() / BP_FACTOR
  const flcTotalProfitBN = flcTotalAssetsAfterRiskBN
    .mul(seniorPostProfitBN)
    .div(weightBN)
  const flcConfigsWithApy = flcConfigs.map((flcConfig) => {
    const minLiquidityBN = BigNumber.from(flcConfig.minLiquidity)
    const flcAssetsAfterRiskBN = minLiquidityBN
      .mul(flcConfig.riskYieldMultiplierInBps)
      .div(BP_FACTOR)

    let apy = 0
    if (minLiquidityBN.gt(0) && flcAssetsAfterRiskBN.gt(0)) {
      const flcProfitBN = flcAssetsAfterRiskBN
        .mul(flcTotalProfitBN)
        .div(flcTotalAssetsAfterRiskBN)
      apy =
        flcProfitBN.mul(BP_FACTOR).div(flcConfig.minLiquidity).toNumber() /
        BP_FACTOR
    }

    return {
      ...flcConfig,
      firstLossCoverIndex: Number(FirstLossCoverIndexes[flcConfig.flcIndex]),
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

export const getPoolApyV2 = (
  protocolFeeInBps: number,
  yieldInBps: number,
  rewardRateInBpsForPoolOwner: number,
  rewardRateInBpsForEA: number,
  liquidityCap: string,
  seniorDeployedAssets: string,
  juniorDeployedAssets: string,
  maxSeniorJuniorRatio: number,
  fixedSeniorYieldInBps: number,
  tranchesRiskAdjustmentInBps: number,
  BP_FACTOR: number,
  FirstLossCoverIndexes: string[] = [],
  flcConfigs: FlcConfig[] = [],
): PoolApy & { maxJuniorTrancheApy: number } => {
  const realApyResult = getPoolApyV2Base(
    protocolFeeInBps,
    yieldInBps,
    rewardRateInBpsForPoolOwner,
    rewardRateInBpsForEA,
    liquidityCap,
    seniorDeployedAssets,
    juniorDeployedAssets,
    maxSeniorJuniorRatio,
    fixedSeniorYieldInBps,
    tranchesRiskAdjustmentInBps,
    BP_FACTOR,
    FirstLossCoverIndexes,
    flcConfigs,
  )

  let liquidityCapBN = BigNumber.from(liquidityCap)
  if (liquidityCapBN.eq(0)) {
    liquidityCapBN = BigNumber.from(seniorDeployedAssets).add(
      BigNumber.from(juniorDeployedAssets),
    )
  }
  const juniorAssetsBN = liquidityCapBN.div(maxSeniorJuniorRatio + 1)
  const seniorAssetsBN = liquidityCapBN.sub(juniorAssetsBN)
  const maxJuniorApyResult = getPoolApyV2Base(
    protocolFeeInBps,
    yieldInBps,
    rewardRateInBpsForPoolOwner,
    rewardRateInBpsForEA,
    liquidityCap,
    seniorAssetsBN.toString(),
    juniorAssetsBN.toString(),
    maxSeniorJuniorRatio,
    fixedSeniorYieldInBps,
    tranchesRiskAdjustmentInBps,
    BP_FACTOR,
  )

  return {
    ...realApyResult,
    maxJuniorTrancheApy: maxJuniorApyResult.juniorTrancheApy,
  }
}
