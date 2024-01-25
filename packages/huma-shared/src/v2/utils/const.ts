import { BigNumber } from 'ethers'

export const BP_FACTOR = BigNumber.from(10000)

export enum KYC_PROVIDER {
  Securitize = 'Securitize',
}

export enum CreditStateV2 {
  Deleted,
  Paused,
  Approved,
  GoodStanding,
  Delayed,
  Defaulted,
}
