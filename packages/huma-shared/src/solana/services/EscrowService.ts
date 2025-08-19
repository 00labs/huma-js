import { gql } from 'graphql-request'

import { configUtil } from '../../utils/config'
import { requestPost } from '../../utils/request'

export type EscrowPayment = {
  assetMint: string
  paymentTransactionHash: string
  bookkeepingTransactionHash: string
  paymentTransactionBlockNumber: number
  createdAt: string
  paymentAmount: string
  paymentSigner: string
  paymentStatus: string
}

export enum EscrowPaymentStatus {
  Initialized = 'Initialized',
  IgnoredDueToUnknownSigner = 'IgnoredDueToUnknownSigner',
  Processing = 'Processing',
  Confirmed = 'Confirmed',
  Error = 'Error',
  RetryNeeded = 'RetryNeeded',
}

function getRecentPayments(
  escrowAccountId: string,
  take: number,
  skip: number,
  isDev: boolean,
  isTestnet: boolean,
): Promise<
  | {
      data: EscrowPayment[]
    }
  | undefined
> {
  const url = configUtil.getEscrowServiceUrl(isTestnet, isDev)

  const options = `
        escrowAccountId: "${escrowAccountId}", 
        take: ${take}, 
        skip: ${skip}, 
      `

  const query = gql`
    {
      escrowPayments(
          input: {
              ${options}
          }
      ) {
        ... on EscrowPaymentsResult {
          data {
            assetMint
            paymentTransactionHash
            bookkeepingTransactionHash
            paymentTransactionBlockNumber
            createdAt
            paymentAmount
            paymentSigner
            paymentStatus
          }
        }
      }
    }
  `

  return requestPost<{
    data?: {
      escrowPayments: {
        data: EscrowPayment[]
      }
    }
    errors?: unknown
  }>(url, JSON.stringify({ query }))
    .then((res) => {
      if (res.errors) {
        console.error(res.errors)
        return undefined
      }
      return res.data?.escrowPayments
    })
    .catch((err) => {
      console.error(err)
      return undefined
    })
}

export const EscrowService = {
  getRecentPayments,
}
