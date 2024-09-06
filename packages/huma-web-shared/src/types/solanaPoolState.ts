export type SolanaPoolState = {
  pool?: string
  seniorTrancheAssets?: string
  juniorTrancheAssets?: string
  poolAprInBps?: number
  poolApr?: string
  liquidityCap?: string
  maxSeniorJuniorRatio?: number
  withdrawalLockoutPeriodDays?: number
  lockupMonthsText?: string
  minDepositAmount?: string
  status?: 'on' | 'off' | 'closed'
}
