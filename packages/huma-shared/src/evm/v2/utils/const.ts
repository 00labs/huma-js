import { BigNumber } from 'ethers'

export const BP_FACTOR = BigNumber.from(10000)

export enum CreditStateV2 {
  Deleted,
  Approved,
  GoodStanding,
  Delayed,
  Defaulted,
}

export enum PoolStatusV2 {
  Off, // The pool is temporarily turned off.
  On, // The pool is active.
  Closed, // The pool is permanently closed after maturity.
}
