/* eslint-disable @typescript-eslint/no-explicit-any */
import { BigNumber } from 'ethers'

import { CreditState, hasRFActiveLoan } from '../../src/evm/utils/credit'

describe('hasRFActiveLoan', () => {
  it('returns false if creditRecord or receivableInfo is undefined', () => {
    expect(hasRFActiveLoan(undefined, undefined)).toBe(false)
    expect(
      hasRFActiveLoan({ state: CreditState.GoodStanding } as any, undefined),
    ).toBe(false)
    expect(
      hasRFActiveLoan(undefined, { receivableParam: BigNumber.from(1) } as any),
    ).toBe(false)
  })

  it('returns false if state is Approved', () => {
    const creditRecord = { state: CreditState.Approved }
    const receivableInfo = { receivableParam: BigNumber.from(1) }

    expect(hasRFActiveLoan(creditRecord as any, receivableInfo as any)).toBe(
      false,
    )
  })

  it('returns true if state is GoodStanding or higher and receivableParam is greater than 0', () => {
    const creditRecord = { state: CreditState.GoodStanding }
    const receivableInfo = { receivableParam: BigNumber.from(1) }

    expect(hasRFActiveLoan(creditRecord as any, receivableInfo as any)).toBe(
      true,
    )
  })

  it('returns false if state is GoodStanding or higher and receivableParam is 0', () => {
    const creditRecord = { state: CreditState.GoodStanding }
    const receivableInfo = { receivableParam: BigNumber.from(0) }

    expect(hasRFActiveLoan(creditRecord as any, receivableInfo as any)).toBe(
      false,
    )
  })
})
