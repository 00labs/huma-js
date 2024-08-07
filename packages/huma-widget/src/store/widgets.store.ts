import { Approval } from '@huma-shan/core'

export enum WIDGET_TYPE {
  BORROW = 'BORROW',
  PAYMENT = 'PAYMENT',
}

export enum WIDGET_STEP {
  SignIn = 'SignIn',
  ChooseTranche = 'ChooseTranche',
  ChoosePaymentType = 'ChoosePaymentType',
  Evaluation = 'Evaluation',
  FirstLossCover = 'FirstLossCover',
  ChooseAmount = 'ChooseAmount',
  Permit = 'Permit',
  ApproveAllowance = 'ApproveAllowance',
  MintNFT = 'MintNFT',
  ConfirmTransfer = 'ConfirmTransfer',
  ApproveNFT = 'ApproveNFT',
  Transfer = 'Transfer',
  CheckWithdrawable = 'CheckWithdrawable',
  Notifications = 'Notifications',
  Done = 'Done',
  Error = 'Error',
}

export type WidgetStream = Partial<{
  borrowFlowrate: string
  durationInSeconds: number
}>

export type MultisendPayload = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addresses: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callData: any[]
}

export type WidgetState = {
  step?: WIDGET_STEP
  type?: WIDGET_TYPE
  approval?: Approval
  borrowAmount?: number
  borrowAmountBN?: JSON
  chargedFees?: number
  borrowAmountNet?: number
  remainder?: number
  paymentAmount?: number
  remainDueAmount?: number
  supplyAmount?: number
  withdrawAmount?: number
  withdrawShares?: number
  redeemAmount?: number
  redeemShares?: number
  errorMessage?: string
  errorReason?: string
  tokenId?: string
  stream?: WidgetStream
  multisend?: MultisendPayload
}

export const initialWidgetState: WidgetState = {}
