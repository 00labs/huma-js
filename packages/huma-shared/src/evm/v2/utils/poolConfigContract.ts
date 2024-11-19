import { BigNumber } from 'ethers'

import { getPoolApyV2 } from '../../utils/apy'
import { FirstLossCoverIndex } from '../types'
import { BP_FACTOR } from './const'

export const getPoolOverviewV2 = (
  protocolFeeInBps: number,
  yieldInBps: number,
  rewardRateInBpsForPoolOwner: number,
  rewardRateInBpsForEA: number,
  liquidityCap: BigNumber,
  seniorDeployedAssets: BigNumber,
  juniorDeployedAssets: BigNumber,
  defaultMaxSeniorJuniorRatio: number,
  fixedSeniorYieldInBps: number,
  tranchesRiskAdjustmentInBps: number,
  flcConfigs: {
    minLiquidity: BigNumber
    riskYieldMultiplierInBps: number
    flcIndex: number
    maxLiquidity: BigNumber
  }[],
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
    BP_FACTOR.toNumber(),
    Object.keys(FirstLossCoverIndex),
    flcConfigs.map((flc) => ({
      ...flc,
      maxLiquidity: flc.maxLiquidity.toString(),
      minLiquidity: flc.minLiquidity.toString(),
    })),
  )
