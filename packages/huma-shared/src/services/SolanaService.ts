import { gql } from 'graphql-request'

import { configUtil } from '../utils/config'
import { requestPost } from '../utils/request'

export type SolanaEvent = {
  name: string
  blockNumber: number
  timestamp: number
  transactionHash: string
  owner: string
  amount: string
}

function getRecentActivities(
  poolId: string,
  first: number,
  skip: number,
  isDev: boolean,
  isTestnet: boolean,
): Promise<
  | {
      totalCount: number
      events: SolanaEvent[]
    }
  | undefined
> {
  const url = configUtil.getCampaignAPIUrl(isDev, isTestnet)

  const query = gql`
    query {
        poolActivityEvents(
        poolId: "${poolId}", 
        first: ${first}, 
        skip: ${skip}, 
        orderBy: "timestamp", 
        orderDirection: "desc"
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

/**
 * An object that contains functions to interact with Huma's solana service.
 * @namespace SolanaService
 */
export const SolanaService = {
  getRecentActivities,
}
