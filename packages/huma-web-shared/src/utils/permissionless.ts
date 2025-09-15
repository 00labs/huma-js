import { BN } from '@coral-xyz/anchor'
import {
  PermissionlessDepositCommitment,
  PermissionlessDepositMode,
  PermissionlessUserFeathersBoosters,
  PERMISSONLESS_FEATHER_MULTIPLIERS,
  SolanaTokenUtils,
} from '@huma-finance/shared'

const getPermissionlessStakedHumaSharesPercentage = (
  stakedHumaShares: BN,
  pstAndMPSTShares: BN,
) => {
  const stakedHumaSharesFormatted = SolanaTokenUtils.formatUnits(
    stakedHumaShares,
    6,
  )
  const pstAndMPSTSharesFormatted = SolanaTokenUtils.formatUnits(
    pstAndMPSTShares,
    6,
  )

  return Number(stakedHumaSharesFormatted) / Number(pstAndMPSTSharesFormatted)
}

export const getPermissonlessStakeFeathersMultiplier = (
  stakedHumaShares?: BN,
  pstAndMPSTShares?: BN,
) => {
  if (
    !stakedHumaShares ||
    stakedHumaShares.isZero() ||
    !pstAndMPSTShares ||
    pstAndMPSTShares.isZero()
  ) {
    return 1
  }

  const stakedHumaSharesPercentage =
    getPermissionlessStakedHumaSharesPercentage(
      stakedHumaShares,
      pstAndMPSTShares,
    )
  return Math.min(2, (1 + stakedHumaSharesPercentage) ** 0.5)
}

export const getPermissonlessLpFeathersMultiplier = (
  mode: PermissionlessDepositMode,
  commitment: PermissionlessDepositCommitment,
  userFeathersBoosters: PermissionlessUserFeathersBoosters,
  stakedHumaShares: BN | undefined,
  pstAndMPSTShares: BN | undefined,
) => {
  const modeCommitmentMultiplier =
    PERMISSONLESS_FEATHER_MULTIPLIERS.MODE_COMMITMENT[`${mode}_${commitment}`]
  const stakeMultiplier = getPermissonlessStakeFeathersMultiplier(
    stakedHumaShares,
    pstAndMPSTShares,
  )
  const ogMultiplier = userFeathersBoosters.og ?? 1
  const vanguardMultiplier = userFeathersBoosters.vanguard ?? 1
  const communityMultiplier = userFeathersBoosters.community ?? 1

  let beta = PERMISSONLESS_FEATHER_MULTIPLIERS.BETA
  if (
    ogMultiplier === PERMISSONLESS_FEATHER_MULTIPLIERS.OG &&
    vanguardMultiplier === PERMISSONLESS_FEATHER_MULTIPLIERS.VANGUARD
  ) {
    beta = PERMISSONLESS_FEATHER_MULTIPLIERS.BETA_WITH_OG_AND_VANGUARD
  }

  return (
    beta *
    Math.tanh(
      (modeCommitmentMultiplier *
        stakeMultiplier *
        ogMultiplier *
        vanguardMultiplier *
        communityMultiplier) /
        beta,
    )
  )
}

export const getPermissonlessLpFeathersPerMonth = (
  amount: number,
  multiplier: number,
) => amount * multiplier
