export type SolanaPoolState = {
  poolId?: string
  seniorTrancheAssets?: string
  juniorTrancheAssets?: string
  poolAprInBps?: number
  poolApr?: string
  liquidityCap?: string
  maxSeniorJuniorRatio?: number
  fixedSeniorYieldBps?: number
  withdrawalLockupPeriodDays?: number
  lockupMonthsText?: string
  minDepositAmount?: string
  status?: 'on' | 'off' | 'closed'
  epochEndTime?: number
  isUniTranche?: boolean
  blendedApy?: number
  seniorTrancheApy?: number
  juniorTrancheApy?: number
  amountDefaulted?: number
  amountOriginated?: number
  amountRepaid?: number
}
