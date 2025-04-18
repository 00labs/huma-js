import { Approval } from '@huma-finance/shared'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LoggingContext } from '@huma-finance/web-shared'

import {
  initialWidgetState,
  MultisendPayload,
  WIDGET_STEP,
  WidgetStream,
} from './widgets.store'

export const widgetSlice = createSlice({
  name: 'widget',
  initialState: initialWidgetState,
  reducers: {
    resetState: (state) => {
      state.errorReason = ''
      state.errorMessage = ''
      state.step = undefined
      state.approval = undefined
      state.borrowAmount = undefined
      state.borrowAmountBN = undefined
      state.chargedFees = undefined
      state.borrowAmountNet = undefined
      state.remainder = undefined
      state.tokenId = undefined
      state.paymentAmount = undefined
      state.remainDueAmount = undefined
      state.stream = undefined
      state.multisend = undefined
      state.supplyAmount = undefined
      state.withdrawAmount = undefined
      state.withdrawShares = undefined
      state.redeemAmount = undefined
      state.redeemShares = undefined
      state.solanaSignature = undefined
      state.txHash = undefined
      state.loggingContext = undefined
    },
    setStep: (state, { payload }: PayloadAction<WIDGET_STEP>) => {
      state.step = payload
    },
    setApproval: (
      state,
      { payload }: PayloadAction<Approval & { nextStep: WIDGET_STEP }>,
    ) => {
      state.approval = payload
      if (Number(payload.terms.creditLimit) > 0) {
        state.step = payload.nextStep
      } else {
        state.errorMessage =
          'Sorry, there was an error with your transaction. Please try submitting again.'
        state.step = WIDGET_STEP.Error
      }
    },
    setBorrowInfo: (
      state,
      {
        payload,
      }: PayloadAction<{
        borrowAmount: number
        borrowAmountBN: JSON
        chargedFees: number
        nextStep: WIDGET_STEP
        remainder?: number
      }>,
    ) => {
      state.borrowAmount = payload.borrowAmount
      state.borrowAmountBN = payload.borrowAmountBN
      state.remainder = payload.remainder
      state.chargedFees = payload.chargedFees
      state.borrowAmountNet = payload.borrowAmount - payload.chargedFees
      state.step = payload.nextStep
    },
    setTokenId: (state, { payload }: PayloadAction<string>) => {
      state.tokenId = payload
    },
    setPaymentAmount: (
      state,
      {
        payload,
      }: PayloadAction<{ paymentAmount: number; remainDueAmount?: number }>,
    ) => {
      state.paymentAmount = payload.paymentAmount
      state.remainDueAmount = payload.remainDueAmount
    },
    setSupplyAmount: (state, { payload }: PayloadAction<number>) => {
      state.supplyAmount = payload
    },
    setWithdrawAmount: (state, { payload }: PayloadAction<number>) => {
      state.withdrawAmount = payload
    },
    setWithdrawShares: (state, { payload }: PayloadAction<number>) => {
      state.withdrawShares = payload
    },
    setRedeemAmount: (state, { payload }: PayloadAction<number>) => {
      state.redeemAmount = payload
    },
    setRedeemShares: (state, { payload }: PayloadAction<number>) => {
      state.redeemShares = payload
    },
    setStream: (state, { payload }: PayloadAction<WidgetStream>) => {
      const stream = state.stream ?? {}
      state.stream = { ...stream, ...payload }
    },
    setMultisend: (state, { payload }: PayloadAction<MultisendPayload>) => {
      state.multisend = payload
    },
    setSolanaSignature: (state, { payload }: PayloadAction<string>) => {
      state.solanaSignature = payload
    },
    setTxHash: (state, { payload }: PayloadAction<string>) => {
      state.txHash = payload
    },
    setPointsAccumulated: (
      state,
      { payload }: PayloadAction<number | undefined>,
    ) => {
      state.pointsAccumulated = payload
    },
    setLoggingContext: (state, { payload }: PayloadAction<LoggingContext>) => {
      state.loggingContext = payload
    },
    setError: (
      state,
      {
        payload,
      }: PayloadAction<{ errorMessage: string; errorReason?: string }>,
    ) => {
      state.errorMessage = payload.errorMessage
      state.errorReason = payload.errorReason
      state.step = WIDGET_STEP.Error
    },
  },
})

export const {
  resetState,
  setStep,
  setApproval,
  setBorrowInfo,
  setError,
  setTokenId,
  setPaymentAmount,
  setStream,
  setMultisend,
  setSupplyAmount,
  setWithdrawAmount,
  setWithdrawShares,
  setRedeemAmount,
  setRedeemShares,
  setSolanaSignature,
  setTxHash,
  setPointsAccumulated,
  setLoggingContext,
} = widgetSlice.actions

export default widgetSlice.reducer
