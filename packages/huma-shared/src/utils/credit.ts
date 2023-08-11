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
}

export const CreditEventText = {
  [String(CreditEvent.DrawdownMade)]: 'Borrow',
  [String(CreditEvent.DrawdownMadeWithReceivable)]: 'Factoring',
  [String(CreditEvent.PaymentMade)]: 'Pay',
  [String(CreditEvent.ReceivedPaymentProcessed)]: 'Pay',
  [String(CreditEvent.LiquidityDeposited)]: 'Supply',
  [String(CreditEvent.LiquidityWithdrawn)]: 'Withdraw',
}
