import { SolanaCampaign } from '@huma-finance/shared'

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
  defaultGracePeriodDays?: number
  status?: 'on' | 'off' | 'closed'
  epochEndTime?: number
  isUniTranche?: boolean
  blendedApy?: number
  rangeApy?: string
  seniorTrancheApy?: number
  juniorTrancheApy?: number
  maxJuniorTrancheApy?: number
  amountDefaulted?: number
  amountOriginated?: number
  amountRepaid?: number
  disbursementReserve?: number
  accruedIncomes?: {
    eaIncome: string
    protocolIncome: string
    poolOwnerIncome: string
  }
  incomeWithdrawn?: {
    eaIncomeWithdrawn: string
    protocolIncomeWithdrawn: string
    poolOwnerIncomeWithdrawn: string
  }
  campaign?: SolanaCampaign
}
