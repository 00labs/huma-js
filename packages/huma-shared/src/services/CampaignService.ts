import { gql } from 'graphql-request'

import { SolanaChainEnum, SolanaPoolInfo } from '../solana'
import { ChainEnum, NETWORK_TYPE } from '../utils/chain'
import { configUtil } from '../utils/config'
import { requestPost } from '../utils/request'
import { PoolInfoV2 } from '../v2/utils/pool'

export type CampaignSeason = {
  id: string
  name: string
  estimatedTotalPoints: number
}

export type CampaignPartner = {
  id: string
  name: string
  multiplier: number
}

export interface BaseCampaign {
  id: string
  name: string
  chainId: string
  juniorMultiplier: number
  seniorMultiplier: number
  lockupPeriodMonths: number
  poolAddress: string
  campaignGroupId: string
  partner?: CampaignPartner | null
  multiplierRange?: string
}

export interface Campaign extends BaseCampaign {
  poolInfo: PoolInfoV2
}

export interface SolanaCampaign extends BaseCampaign {
  solanaPoolInfo: SolanaPoolInfo
}

export type CampaignGroup = {
  id: string
  name: string
  campaigns: Campaign[]
  partners: CampaignPartner[]
}

export type SolanaCampaignGroup = {
  id: string
  name: string
  campaigns: SolanaCampaign[]
  partners: CampaignPartner[]
}

type CampaignPoints = {
  campaignId: string
  juniorTranchePoints: number
  seniorTranchePoints: number
  lockupPeriodMonths: number
}

export type LeaderboardItem = {
  accountId: string
  accountName: string
  points: number
  rank: number
  referredCount: number
}

export type HumaAccountPoints = {
  accountId: string
  totalPoints: number
  basePoints: number
  liquidityPoints: number
  liquidityPointsList: {
    address: string
    points: number
  }[]
  referralPoints: number
}

function checkWalletOwnership(
  wallet: string,
  networkType: NETWORK_TYPE,
  isDev: boolean,
): Promise<boolean | undefined> {
  const url = configUtil.getCampaignAPIUrlV2(networkType, isDev)

  const query = gql`
    query {
      walletOwnership(address: "${wallet}")
    }
  `

  return requestPost<{
    data?: {
      walletOwnership: boolean
    }
    errors?: unknown
  }>(url, JSON.stringify({ query }))
    .then((res) => {
      if (res.errors) {
        console.error(res.errors)
        return undefined
      }
      return res.data?.walletOwnership
    })
    .catch((err) => {
      console.error(err)
      return undefined
    })
}

function getLeaderboard(
  seasonId: string,
  networkType: NETWORK_TYPE,
  isDev: boolean,
): Promise<
  | {
      leaderboardItems: LeaderboardItem[]
      accountLeaderboard: LeaderboardItem | undefined
    }
  | undefined
> {
  const url = configUtil.getCampaignAPIUrlV2(networkType, isDev)

  const query = gql`
    query {
      leaderboard(seasonId: "${seasonId}") {
        ... on LeaderboardResult {
          data {
            accountId
            accountName
            points
            referredCount
            rank
          }
        }
        ... on PointServiceError {
          message
        }
      }
    }
  `

  return requestPost<{
    data?: { leaderboard: { data: LeaderboardItem[] } }
    errors?: unknown
  }>(url, JSON.stringify({ query }))
    .then((res) => {
      if (res.errors) {
        console.error(res.errors)
        return undefined
      }
      const leaderboardItems = res.data?.leaderboard?.data
      let accountLeaderboard: LeaderboardItem | undefined
      if (leaderboardItems) {
        // This means that the first item is the user itself
        if (leaderboardItems[1]?.rank === 1) {
          accountLeaderboard = leaderboardItems.shift()
        }
      }
      return {
        leaderboardItems: leaderboardItems ?? [],
        accountLeaderboard,
      }
    })
    .catch((err) => {
      console.error(err)
      return undefined
    })
}

function getHumaAccountPoints(
  networkType: NETWORK_TYPE,
  isDev: boolean,
): Promise<HumaAccountPoints | undefined> {
  const url = configUtil.getCampaignAPIUrlV2(networkType, isDev)

  const query = gql`
    query {
      accountPoints {
        ... on AccountPointsResult {
          accountId
          basePoints
          liquidityPoints
          liquidityPointsList {
            address
            points
          }
          referralPoints
        }
        ... on PointServiceError {
          message
        }
      }
    }
  `

  return requestPost<{
    data?: { accountPoints: HumaAccountPoints }
    errors?: unknown
  }>(url, JSON.stringify({ query }))
    .then((res) => {
      if (res.errors) {
        console.error(res.errors)
        return undefined
      }
      const accountPoints = res.data?.accountPoints
      if (accountPoints) {
        accountPoints.totalPoints =
          accountPoints.basePoints +
          accountPoints.liquidityPoints +
          accountPoints.referralPoints
      }
      return accountPoints
    })
    .catch((err) => {
      console.error(err)
      return undefined
    })
}

function getEstimatedPoints(
  campaignGroupId: string,
  principal: string,
  networkType: NETWORK_TYPE,
  isDev: boolean,
): Promise<CampaignPoints[]> {
  const url = configUtil.getCampaignAPIUrlV2(networkType, isDev)

  const query = gql`
    query {
      calculateEstimatedPoints(input: {campaignGroupId:"${campaignGroupId}", principal:"${principal}"}){
        campaignPointsEstimations {
          campaignId
          juniorTranchePoints
          seniorTranchePoints
          lockupPeriodMonths
        }
      }
    }
  `

  return requestPost<{
    data?: {
      calculateEstimatedPoints?: {
        campaignPointsEstimations?: CampaignPoints[]
      }
    }
    errors?: unknown
  }>(url, JSON.stringify({ query }))
    .then((res) => {
      if (res.errors) {
        console.error(res.errors)
        return []
      }
      return res.data?.calculateEstimatedPoints?.campaignPointsEstimations ?? []
    })
    .catch((err) => {
      console.error(err)
      return []
    })
}

function updateHumaAccountPoints(
  walletAddress: string,
  transactionHash: string,
  chainId: ChainEnum | SolanaChainEnum,
  networkType: NETWORK_TYPE,
  isDev: boolean,
): Promise<{ pointsAccumulated?: number }> {
  const url = configUtil.getCampaignAPIUrlV2(networkType, isDev)

  const query = gql`
    mutation {
      updateAccountPoints(
        input: {
          chainId: ${chainId},
          walletAddress: "${walletAddress}",
          transactionHash: "${transactionHash}"
        }
      ) {
        ... on UpdateAccountPointsResult {
          pointsAccumulated
        }
        ... on PointServiceError {
          message
        }
      }
    }
  `

  return requestPost<{
    data?: {
      updateAccountPoints?: { pointsAccumulated?: number }
    }
    errors?: unknown
  }>(url, JSON.stringify({ query }))
    .then((res) => {
      if (res.errors) {
        console.error(res.errors)
        return {}
      }
      return res.data?.updateAccountPoints ?? {}
    })
    .catch((err) => {
      console.error(err)
      return {}
    })
}

/**
 * An object that contains functions to interact with Huma's campaign service.
 * @namespace CampaignService
 */
export const CampaignService = {
  checkWalletOwnership,
  getEstimatedPoints,
  getLeaderboard,
  getHumaAccountPoints,
  updateHumaAccountPoints,
}
