import { gql } from 'graphql-request'

import { configUtil } from '../utils/config'
import { requestPost } from '../utils/request'

/**
 * Represents the pagination options for a query.
 * @typedef {Object} Pagination
 */
export type Pagination = {
  first: number | null
  skip: number | null
  orderBy: string
  orderDirection: 'desc' | 'asc'
}

type CampaignPoints = {
  campaignId: string
  juniorTranchePoints: number
  seniorTranchePoints: number
  lockupPeriodMonths: number
}

function getEstimatedPoints(
  campaignGroupId: string,
  principal: string,
): Promise<CampaignPoints[]> {
  const url = configUtil.getCampaignAPIUrl()

  const query = gql`
    query {
      calculatePoints(input: {campaignGroupId:"${campaignGroupId}", principal:${Number(
    principal,
  )}}){
        campaignPointsEstimations {
          campaignId
          juniorTranchePoints
          seniorTranchePoints
          lockupPeriodMonths
        }
      }
    }
  `

  return (
    requestPost(url, JSON.stringify({ query }))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((res: any) => {
        if (res.errors) {
          console.error(res.errors)
          return []
        }
        return res.data.calculatePoints.campaignPointsEstimations
      })
      .catch((err) => {
        console.error(err)
        return []
      })
  )
}

function createNewWallet(
  account: string,
  referenceCode?: string,
): Promise<void> {
  const url = configUtil.getCampaignAPIUrl()

  const query = gql`
    mutation {
      createWallet(
        input: {
          address: "${account}"
          referrerCode: "${referenceCode}"
        }
      ) {
        ... on CreateNewWalletResult {
          wallet {
            address
          }
        }
      }
    }
  `

  return (
    requestPost(url, JSON.stringify({ query }))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((res: any) => {
        if (res.errors) {
          console.error(res.errors)
          return []
        }
        return res.data.calculatePoints.campaignPointsEstimations
      })
      .catch((err) => {
        console.error(err)
        return []
      })
  )
}

/**
 * An object that contains functions to interact with Huma's campaign service.
 * @namespace SubgraphService
 */
export const CampaignService = {
  getEstimatedPoints,
  createNewWallet,
}
