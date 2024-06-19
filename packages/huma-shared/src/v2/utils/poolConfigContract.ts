import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import { BigNumber } from 'ethers'

import {
  getChainIdFromSignerOrProvider,
  getContract,
  POOL_NAME,
} from '../../utils'
import HUMA_CONFIG_ABI from '../abis/HumaConfig.json'
import { HumaConfig, PoolConfig } from '../abis/types'
import { FirstLossCoverConfigStructOutput } from '../abis/types/PoolConfig'
import { FirstLossCoverIndex } from '../types'
import { BP_FACTOR } from './const'
import { PoolInfoV2 } from './pool'
import { getPoolConfigContractV2, getPoolInfoV2 } from './poolContract'

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

  const totalProfit = liquidityCap.mul(APY)
  const postPoolProfitRatio =
    (1 - protocolFeeInBps / BP_FACTOR_NUMBER) *
    (1 -
      rewardRateInBpsForPoolOwner / BP_FACTOR_NUMBER -
      rewardRateInBpsForEA / BP_FACTOR_NUMBER)
  const poolPostProfit = totalProfit.mul(postPoolProfitRatio)
  const blendedApy = poolPostProfit.mul(100).div(liquidityCap).toNumber() / 100

  let seniorTrancheApy = 0
  let seniorPostProfit = BigNumber.from(0)
  if (fixedSeniorYieldInBps > 0) {
    seniorTrancheApy = fixedSeniorYieldInBps / BP_FACTOR_NUMBER
    seniorPostProfit = poolPostProfit.sub(seniorAssets.mul(seniorTrancheApy))
  } else {
    const riskAdjustment = tranchesRiskAdjustmentInBps / BP_FACTOR_NUMBER
    const seniorProfit = seniorAssets.mul(
      postPoolProfitRatio * (1 - riskAdjustment) * APY,
    )
    seniorTrancheApy = postPoolProfitRatio * (1 - riskAdjustment) * APY
    seniorPostProfit = poolPostProfit.sub(seniorProfit)
  }

  const flcTotalAssetsAfterRisk = getFlcTotalAssetsAfterRisk(flcConfigs)
  const weight = juniorAssets.add(flcTotalAssetsAfterRisk)

  const juniorProfit = juniorAssets.mul(seniorPostProfit).div(weight)
  const juniorTrancheApy =
    juniorProfit.mul(100).div(juniorAssets).toNumber() / 100
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
      apy = flcProfit.mul(100).div(flcConfig.minLiquidity).toNumber() / 100
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
