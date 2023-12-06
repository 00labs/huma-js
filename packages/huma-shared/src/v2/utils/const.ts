import { BigNumber } from 'ethers'

export const BP_FACTOR = BigNumber.from(10000)

export enum CreditStateV2 {
  Deleted,
  Approved,
  GoodStanding,
  Delayed,
  Defaulted,
  Paused,
}
