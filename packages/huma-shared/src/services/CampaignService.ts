import { gql } from 'graphql-request'

import { SolanaChainEnum, SolanaPoolInfo } from '../solana'
import { StellarPoolInfo } from '../stellar'
import { ChainEnum, NETWORK_TYPE } from '../utils/chain'
import { configUtil } from '../utils/config'
import { COMMON_ERROR_MESSAGE } from '../utils/const'
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

export interface StellarCampaign extends BaseCampaign {
  stellarPoolInfo: StellarPoolInfo
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

export type StellarCampaignGroup = {
  id: string
  name: string
  campaigns: StellarCampaign[]
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
  ranking: number
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
  bonusPoints: number
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
      walletOwnership: boolean & { errMessage: string }
    }
    errors?: unknown
  }>(url, JSON.stringify({ query }))
    .then((res) => {
      if (res.errors) {
        console.log(res.errors)
        throw new Error(COMMON_ERROR_MESSAGE)
      }
      const errMessage = res.data?.walletOwnership?.errMessage
      if (errMessage) {
        console.error(errMessage)
        throw new Error(errMessage)
      }
      return res.data?.walletOwnership
    })
    .catch((err) => {
      console.error(err)
      throw new Error(COMMON_ERROR_MESSAGE)
    })
}

function getLeaderboard(
  seasonId: string,
  networkType: NETWORK_TYPE,
  isDev: boolean,
): Promise<LeaderboardItem[] | undefined> {
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
            ranking
          }
        }
        ... on PointServiceError {
          errMessage
        }
      }
    }
  `

  return requestPost<{
    data?: { leaderboard: { data: LeaderboardItem[] & { errMessage: string } } }
    errors?: unknown
  }>(url, JSON.stringify({ query }))
    .then((res) => {
      if (res.errors) {
        console.log(res.errors)
        throw new Error(COMMON_ERROR_MESSAGE)
      }
      const errMessage = res.data?.leaderboard?.data?.errMessage
      if (errMessage) {
        console.error(errMessage)
        throw new Error(errMessage)
      }
      return res.data?.leaderboard?.data
    })
    .catch((err) => {
      console.error(err)
      throw new Error(COMMON_ERROR_MESSAGE)
    })
}

function getHumaAccountRanking(
  seasonId: string,
  networkType: NETWORK_TYPE,
  isDev: boolean,
): Promise<LeaderboardItem | undefined> {
  const url = configUtil.getCampaignAPIUrlV2(networkType, isDev)

  const query = gql`
    query {
      myRankingEntry(seasonId: "${seasonId}") {
        ... on LeaderboardItem {
          accountId
          accountName
          points
          referredCount
          ranking
        }
        ... on PointServiceError {
            errMessage
        }
      }
  }
  `

  return requestPost<{
    data?: { myRankingEntry: LeaderboardItem & { errMessage: string } }
    errors?: unknown
  }>(url, JSON.stringify({ query }))
    .then((res) => {
      if (res.errors) {
        console.log(res.errors)
        throw new Error(COMMON_ERROR_MESSAGE)
      }
      const errMessage = res.data?.myRankingEntry?.errMessage
      if (errMessage) {
        console.error(errMessage)
        throw new Error(errMessage)
      }

      return res.data?.myRankingEntry
    })
    .catch((err) => {
      console.error(err)
      throw new Error(COMMON_ERROR_MESSAGE)
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
          bonusPoints
        }
        ... on PointServiceError {
          errMessage
        }
      }
    }
  `

  return requestPost<{
    data?: { accountPoints: HumaAccountPoints & { errMessage: string } }
    errors?: unknown
  }>(url, JSON.stringify({ query }))
    .then((res) => {
      if (res.errors) {
        console.log(res.errors)
        throw new Error(COMMON_ERROR_MESSAGE)
      }
      const errMessage = res.data?.accountPoints?.errMessage
      if (errMessage) {
        console.error(errMessage)
        throw new Error(errMessage)
      }

      const accountPoints = res.data?.accountPoints
      if (accountPoints) {
        accountPoints.totalPoints =
          accountPoints.basePoints +
          accountPoints.liquidityPoints +
          accountPoints.referralPoints +
          accountPoints.bonusPoints
      }
      return accountPoints
    })
    .catch((err) => {
      console.error(err)
      throw new Error(COMMON_ERROR_MESSAGE)
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
          ... on CalculatePointsResult {
          campaignPointsEstimations {
            campaignId
            juniorTranchePoints
            lockupPeriodMonths
            seniorTranchePoints
          }
        }
        ... on PointServiceError {
          errMessage
        }
      }
    }
  `

  return requestPost<{
    data?: {
      calculateEstimatedPoints?: {
        campaignPointsEstimations?: CampaignPoints[]
      } & { errMessage: string }
    }
    errors?: unknown
  }>(url, JSON.stringify({ query }))
    .then((res) => {
      if (res.errors) {
        console.error(res.errors)
        throw new Error(COMMON_ERROR_MESSAGE)
      }
      const errMessage = res.data?.calculateEstimatedPoints?.errMessage
      if (errMessage) {
        console.error(errMessage)
        throw new Error(errMessage)
      }

      return res.data?.calculateEstimatedPoints?.campaignPointsEstimations ?? []
    })
    .catch((err) => {
      console.error(err)
      throw new Error(COMMON_ERROR_MESSAGE)
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
          errMessage
        }
      }
    }
  `

  return requestPost<{
    data?: {
      updateAccountPoints?: { pointsAccumulated?: number } & {
        errMessage: string
      }
    }
    errors?: unknown
  }>(url, JSON.stringify({ query }))
    .then((res) => {
      if (res.errors) {
        console.log(res.errors)
        throw new Error(COMMON_ERROR_MESSAGE)
      }
      const errMessage = res.data?.updateAccountPoints?.errMessage
      if (errMessage) {
        console.error(errMessage)
        throw new Error(errMessage)
      }

      return res.data?.updateAccountPoints ?? {}
    })
    .catch((err) => {
      console.error(err)
      throw new Error(COMMON_ERROR_MESSAGE)
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
  getHumaAccountRanking,
  getHumaAccountPoints,
  updateHumaAccountPoints,
}
