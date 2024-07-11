import { gql } from 'graphql-request'

import { ChainEnum } from '../utils/chain'
import { configUtil } from '../utils/config'
import { requestPost } from '../utils/request'
import { PoolInfoV2 } from '../v2/utils/pool'

type Season = {
  id: string
  estimatedTotalPoints: number
  name: string
}

type CampaignGroup = {
  id: string
  name: string
  campaigns: Campaign[]
  partners: {
    id: string
    name: string
  }[]
}

type Campaign = {
  id: string
  name: string
  chainId: string
  juniorMultiplier: number
  lockupPeriodMonths: number
  seniorMultiplier: number
  poolAddress: string
  campaignGroupId?: string
  referenceCode?: string | null
  poolInfo?: PoolInfoV2 | null
}

function getActiveSeasonAndCampaignGroups(): Promise<{
  activeSeason: Season
  campaignGroups: CampaignGroup[]
}> {
  const url = configUtil.getCampaignAPIUrl()

  const query = gql`
    query {
      activeSeason {
        id
        estimatedTotalPoints
        name
      }
      campaignGroups {
        id
        name
        campaigns {
          id
          name
          chainId
          juniorMultiplier
          lockupPeriodMonths
          seniorMultiplier
          poolAddress
        }
        partners {
          id
          name
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
          return {}
        }
        return res.data
      })
      .catch((err) => {
        console.error(err)
        return {}
      })
  )
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
): Promise<{ address: string }> {
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
        return res.data.createWallet.wallet
      })
      .catch((err) => {
        console.error(err)
        return []
      })
  )
}

function updateWalletPoints(
  chainId: ChainEnum,
  account: string,
  hash: string,
): Promise<{ pointAccumulated: number }> {
  const url = configUtil.getCampaignAPIUrl()

  const query = gql`
    mutation {
      updateWalletPoints(
        input: {
          chainId: ${chainId},
          walletAddress: "${account}",
          transactionHash: "${hash}"
        }
      ) {
        ... on UpdateWalletPointsResult {
          pointAccumulated
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
        return res.data.updateWalletPoints
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
  getCampaignGroups: getActiveSeasonAndCampaignGroups,
  getEstimatedPoints,
  createNewWallet,
  updateWalletPoints,
}
