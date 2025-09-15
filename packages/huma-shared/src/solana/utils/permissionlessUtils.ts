export enum PermissionlessDepositMode {
  CLASSIC = 'classic',
  MAXI = 'maxi',
}

export enum PermissionlessDepositCommitment {
  NO_COMMIT = 'NO_COMMITMENT',
  INITIAL_COMMITMENT_THREE_MONTHS = 'INITIAL_COMMITMENT_THREE_MONTHS',
  INITIAL_COMMITMENT_SIX_MONTHS = 'INITIAL_COMMITMENT_SIX_MONTHS',
}

export interface PermissionlessDepositCommitOption {
  title: string
  titleShort: string
  featherMultiplier: number
  months: number
}

export const PERMISSONLESS_FEATHER_MULTIPLIERS = {
  COMMITMENT: {
    NO_COMMIT: 1,
    THREE_MONTHS: 3,
    SIX_MONTHS: 5,
  },
  MODE: {
    CLASSIC: 1,
    MAXI: 3,
  },
  MODE_COMMITMENT: {
    [`${PermissionlessDepositMode.CLASSIC}_${PermissionlessDepositCommitment.NO_COMMIT}`]: 1,
    [`${PermissionlessDepositMode.CLASSIC}_${PermissionlessDepositCommitment.INITIAL_COMMITMENT_THREE_MONTHS}`]: 3,
    [`${PermissionlessDepositMode.CLASSIC}_${PermissionlessDepositCommitment.INITIAL_COMMITMENT_SIX_MONTHS}`]: 5,
    [`${PermissionlessDepositMode.MAXI}_${PermissionlessDepositCommitment.NO_COMMIT}`]: 5,
    [`${PermissionlessDepositMode.MAXI}_${PermissionlessDepositCommitment.INITIAL_COMMITMENT_THREE_MONTHS}`]: 9,
    [`${PermissionlessDepositMode.MAXI}_${PermissionlessDepositCommitment.INITIAL_COMMITMENT_SIX_MONTHS}`]: 15,
  },
  STAKE: {
    NO_LOCKUP: 0,
    LOCKUP: 5,
    UNSTAKING_COOLDOWN: 14,
  },
  ALPHA: 20,
  BETA: 20,
  BETA_WITH_OG_AND_VANGUARD: 22.5,
  OG: 1.2,
  VANGUARD: 1.2,
  COMMUNITY: 1.2,
}

export const PermissionlessDepositCommitOptions: Record<
  PermissionlessDepositCommitment,
  PermissionlessDepositCommitOption
> = {
  [PermissionlessDepositCommitment.NO_COMMIT]: {
    title: 'No lockup',
    titleShort: 'No lockup',
    months: 0,
    featherMultiplier: PERMISSONLESS_FEATHER_MULTIPLIERS.COMMITMENT.NO_COMMIT,
  },
  [PermissionlessDepositCommitment.INITIAL_COMMITMENT_THREE_MONTHS]: {
    title: '3 months',
    titleShort: '3mo',
    months: 3,
    featherMultiplier:
      PERMISSONLESS_FEATHER_MULTIPLIERS.COMMITMENT.THREE_MONTHS,
  },
  [PermissionlessDepositCommitment.INITIAL_COMMITMENT_SIX_MONTHS]: {
    title: '6 months',
    titleShort: '6mo',
    months: 6,
    featherMultiplier: PERMISSONLESS_FEATHER_MULTIPLIERS.COMMITMENT.SIX_MONTHS,
  },
}
