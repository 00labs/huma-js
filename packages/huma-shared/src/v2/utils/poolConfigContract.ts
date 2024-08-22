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

const getProtocolFeeInBps = async (
  poolConfigContract: PoolConfig,
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<number> => {
  const humaConfig = await poolConfigContract.humaConfig()
  const humaConfigContract = getContract(
    humaConfig,
    HUMA_CONFIG_ABI,
    provider,
  ) as HumaConfig
  return humaConfigContract.protocolFeeInBps()
}

const getFlcConfigs = async (
  poolInfo: PoolInfoV2,
  poolConfigContract: PoolConfig,
): Promise<FirstLossCoverConfigStructOutput[]> => {
  const flcConfigs = await Promise.all(
    Object.values(poolInfo.firstLossCovers).map((firstLossCover: string) =>
      poolConfigContract.getFirstLossCoverConfig(firstLossCover),
    ),
  )
  return flcConfigs
}

const getFlcTotalAssetsAfterRisk = (
  flcConfigs: FirstLossCoverConfigStructOutput[],
): number => {
  const flcTotalAssetsAfterRisk = flcConfigs.reduce(
    (acc, flcConfig) =>
      acc.add(
        flcConfig.minLiquidity
          .mul(flcConfig.riskYieldMultiplierInBps)
          .div(BP_FACTOR),
      ),
    BigNumber.from(0),
  )
  return flcTotalAssetsAfterRisk.toNumber()
}

export const getPoolOverviewV2 = async (
  poolName: POOL_NAME,
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<
  | {
      lpConfig: {
        liquidityCap: BigNumber
        maxSeniorJuniorRatio: number
        fixedSeniorYieldInBps: number
        tranchesRiskAdjustmentInBps: number
        withdrawalLockoutPeriodInDays: number
      }
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
    }
  | undefined
> => {
  const chainId = await getChainIdFromSignerOrProvider(provider)
  const poolInfo = getPoolInfoV2(poolName, chainId)
  if (!poolInfo) {
    return undefined
  }
  const poolConfigContract = await getPoolConfigContractV2(poolName, provider)
  if (!poolConfigContract) {
    return undefined
  }

  const [protocolFeeInBps, feeStructure, adminRnR, lpConfig, flcConfigs] =
    await Promise.all([
      getProtocolFeeInBps(poolConfigContract, provider),
      poolConfigContract.getFeeStructure(),
      poolConfigContract.getAdminRnR(),
      poolConfigContract.getLPConfig(),
      getFlcConfigs(poolInfo, poolConfigContract),
    ])

  const BP_FACTOR_NUMBER = BP_FACTOR.toNumber()
  const APY = feeStructure.yieldInBps
  
  const poolCap = lpConfig.liquidityCap.toNumber()
  const juniorAssets = poolCap / (lpConfig.maxSeniorJuniorRatio + 1)
  const seniorAssets = poolCap - juniorAssets

  const totalProfit = poolCap * APY
  const postPoolProfitRatio =
    (1 - protocolFeeInBps / BP_FACTOR_NUMBER) *
    (1 -
      adminRnR.rewardRateInBpsForPoolOwner / BP_FACTOR_NUMBER -
      adminRnR.rewardRateInBpsForEA / BP_FACTOR_NUMBER)
  const poolPostProfit = totalProfit * postPoolProfitRatio
  const blendedApy = poolPostProfit / poolCap

  let seniorTrancheApy = 0
  let seniorPostProfit = 0
  if (lpConfig.fixedSeniorYieldInBps > 0) {
    seniorTrancheApy = lpConfig.fixedSeniorYieldInBps / BP_FACTOR_NUMBER
    seniorPostProfit = poolPostProfit - seniorAssets * seniorTrancheApy
  } else {
    const riskAdjustment =
      lpConfig.tranchesRiskAdjustmentInBps / BP_FACTOR_NUMBER
    const seniorProfit =
      seniorAssets * (postPoolProfitRatio * (1 - riskAdjustment) * APY)
    seniorTrancheApy = postPoolProfitRatio * (1 - riskAdjustment) * APY
    seniorPostProfit = poolPostProfit - seniorProfit
  }

  const flcTotalAssetsAfterRisk = getFlcTotalAssetsAfterRisk(flcConfigs)
  const weight = juniorAssets + flcTotalAssetsAfterRisk

  const juniorProfit = (juniorAssets / weight) * seniorPostProfit
  const juniorTrancheApy = juniorProfit / juniorAssets
  const flcTotalProfit = (flcTotalAssetsAfterRisk / weight) * seniorPostProfit
  const flcConfigsWithApy = flcConfigs.map((flcConfig, index) => {
    const flcAssetsAfterRisk = flcConfig.minLiquidity
      .mul(flcConfig.riskYieldMultiplierInBps)
      .div(BP_FACTOR)

    let apy = 0
    if (flcConfig.minLiquidity.gt(0) && flcAssetsAfterRisk.gt(0)) {
      const flcProfit =
        (flcAssetsAfterRisk.toNumber() / flcTotalAssetsAfterRisk) *
        flcTotalProfit
      apy = flcProfit / flcConfig.minLiquidity.toNumber()
    }

    return {
      firstLossCoverIndex: Number(Object.keys(FirstLossCoverIndex)[index]),
      maxLiquidity: flcConfig.maxLiquidity,
      minLiquidity: flcConfig.minLiquidity,
      riskYieldMultiplierInBps: flcConfig.riskYieldMultiplierInBps,
      apy,
    }
  })

  return {
    lpConfig,
    flcConfigsWithApy,
    blendedApy,
    seniorTrancheApy,
    juniorTrancheApy,
  }
}
