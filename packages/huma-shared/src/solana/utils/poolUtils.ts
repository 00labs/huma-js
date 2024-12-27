import { BN } from '@coral-xyz/anchor'

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

export const getSolanaTrancheSharePrice = (
  totalAssets: BN,
  totalSupply: BN,
) => {
  totalAssets.muln(100000).div(totalSupply).toNumber() / 100000,
}

