import { CreditRecordType, ReceivableInfoType } from '../hooks/usePoolContract'

export enum CreditState {
  Deleted = 0,
  Requested = 1,
  Approved = 2,
  GoodStanding = 3,
  Delayed = 4,
  Defaulted = 5,
}

export const hasRFActiveLoan = (
  creditRecord?: CreditRecordType,
  receivableInfo?: ReceivableInfoType,
) => {
  if (creditRecord === undefined || receivableInfo === undefined) {
    return false
  }
  let accountHasActiveLoan =
    creditRecord.state >= CreditState.GoodStanding &&
    receivableInfo.receivableParam.gt(0)
  if (accountHasActiveLoan && creditRecord.state === CreditState.Approved) {
    accountHasActiveLoan = false
  }
  return accountHasActiveLoan
}

export enum CreditEvent {
  LiquidityDeposited = 0,
  LiquidityWithdrawn = 1,
  DrawdownMade = 2,
  DrawdownMadeWithReceivable = 3,
  PaymentMade = 4,
  ReceivedPaymentProcessed = 5,
  ExtraFundsDispersed = 6,
  Defaulted = 7,
  PrincipalPaymentMade = 8,
  RemainingPeriodsExtended = 9,
  CreditPaused = 10,
  CreditClosed = 11,
  CreditLineChanged = 12,
  YieldReinvested = 13,
  CreditLineApproved = 14,
  PaymentMadeWithReceivable = 15,
  PrincipalPaymentMadeWithReceivable = 16,
}

export enum LenderEvent {
  LiquidityDeposited = 0,
  YieldReinvested = 1,
  YieldPaidout = 2,
  RedemptionRequestAdded = 3,
  RedemptionRequestRemoved = 4,
  LenderFundDisbursed = 5,
  ReinvestYieldConfigSet = 6,
  CoverDeposited = 7,
  CoverRedeemed = 8,
}

export const CreditEventText = {
  [String(CreditEvent.DrawdownMade)]: 'Borrow',
  [String(CreditEvent.DrawdownMadeWithReceivable)]: 'Borrow',
  [String(CreditEvent.PaymentMade)]: 'Pay',
  [String(CreditEvent.PaymentMadeWithReceivable)]: 'Pay',
  [String(CreditEvent.PrincipalPaymentMade)]: 'Pay',
  [String(CreditEvent.PrincipalPaymentMadeWithReceivable)]: 'Pay',
  [String(CreditEvent.ReceivedPaymentProcessed)]: 'Pay',
  [String(CreditEvent.LiquidityDeposited)]: 'Supply',
  [String(CreditEvent.LiquidityWithdrawn)]: 'Withdraw',
}

export const LenderEventText = {
  [String(LenderEvent.LiquidityDeposited)]: 'Supply',
  [String(LenderEvent.YieldReinvested)]: 'Yield reinvest',
  [String(LenderEvent.YieldPaidout)]: 'Yield paidout',
  [String(LenderEvent.RedemptionRequestAdded)]: 'Request redemption',
  [String(LenderEvent.RedemptionRequestRemoved)]: 'Cancel redemption request',
  [String(LenderEvent.LenderFundDisbursed)]: 'Withdraw',
  [String(LenderEvent.CoverDeposited)]: 'Supply first loss cover',
  [String(LenderEvent.CoverRedeemed)]: 'Redeem first loss cover',
}
