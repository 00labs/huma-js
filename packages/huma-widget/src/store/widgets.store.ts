import { Approval } from '@huma-finance/shared'

export enum WIDGET_TYPE {
  BORROW = 'BORROW',
  PAYMENT = 'PAYMENT',
}

export enum WIDGET_STEP {
  Evaluation = 'Evaluation',
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
  borrowAmountBN?: string
  chargedFees?: number
  borrowAmountNet?: number
  remainder?: number
  paymentAmount?: number
  remainDueAmount?: number
  supplyAmount?: number
  withdrawAmount?: number
  errorMessage?: string
  errorReason?: string
  tokenId?: string
  stream?: WidgetStream
  multisend?: MultisendPayload
}

export const initialWidgetState: WidgetState = {}
