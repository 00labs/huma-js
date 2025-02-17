import { gql } from 'graphql-request'

import { configUtil } from '../../utils/config'
import { requestPost } from '../../utils/request'

export type SolanaEvent = {
  name: string
  blockNumber: number
  timestamp: number
  transactionHash: string
  owner: string
  amount: string
}

export type SolanaReceivableEvent = {
  blockNumber: number
  timestamp: number
  transactionHash: string
  pool: string
  owner: string
  asset: string
  paidAmount: string
  receivableAmount: string
  referenceId: string
  currencyCode: number
  maturityDate: number
}

function getRecentActivities(
  poolConfig: string,
  first: number,
  skip: number,
  isDev: boolean,
  isTestnet: boolean,
  filters?: {
    owner?: string
    events?: string[]
  },
): Promise<
  | {
      totalCount: number
      events: SolanaEvent[]
    }
  | undefined
> {
  const { owner, events } = filters || {}
  const url = configUtil.getSolanaGraphAPIUrl(isTestnet, isDev)

  let options = `
        poolConfigPDA: "${poolConfig}", 
        first: ${first}, 
        skip: ${skip}, 
        orderBy: "timestamp", 
        orderDirection: "desc"
      `
  if (owner) {
    options += `, owner: "${owner}"`
  }
  if (events) {
    options += `, nameIn: ["${events.join('","')}"]`
  }

  const query = gql`
    query {
        poolActivityEvents(
          ${options}
      ) {
        totalCount
        events {
          name
          blockNumber
          timestamp
          transactionHash
          owner
          amount
        }
      }
    }
  `

  return requestPost<{
    data?: {
      poolActivityEvents: {
        totalCount: number
        events: SolanaEvent[]
      }
    }
    errors?: unknown
  }>(url, JSON.stringify({ query }))
    .then((res) => {
      if (res.errors) {
        console.error(res.errors)
        return undefined
      }
      return res.data?.poolActivityEvents
    })
    .catch((err) => {
      console.error(err)
      return undefined
    })
}

function getReceivableLivestream(
  poolConfig: string,
  first: number,
  skip: number,
  isDev: boolean,
  isTestnet: boolean,
): Promise<
  | {
      totalCount: number
      events: SolanaReceivableEvent[]
    }
  | undefined
> {
  const url = configUtil.getSolanaGraphAPIUrl(isTestnet, isDev)

  const query = gql`
    query {
      receivableEvents(
        poolConfigPDA: "${poolConfig}", 
        first: ${first}, 
        skip: ${skip}, 
        orderBy: "timestamp", 
        orderDirection: "desc"
      ) {
        totalCount
        events {
          blockNumber
          timestamp
          transactionHash
          poolConfigPDA
          owner
          asset
          paidAmount
          receivableAmount
          referenceId
          currencyCode
          maturityDate
        }
      }
    }
  `

  return requestPost<{
    data?: {
      receivableEvents: {
        totalCount: number
        events: SolanaReceivableEvent[]
      }
    }
    errors?: unknown
  }>(url, JSON.stringify({ query }))
    .then((res) => {
      if (res.errors) {
        console.error(res.errors)
        return undefined
      }
      return res.data?.receivableEvents
    })
    .catch((err) => {
      console.error(err)
      return undefined
    })
}

/**
 * An object that contains functions to interact with Huma's solana service.
 * @namespace SolanaService
 */
export const SolanaService = {
  getRecentActivities,
  getReceivableLivestream,
}
