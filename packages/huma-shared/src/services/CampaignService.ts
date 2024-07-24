import { gql } from 'graphql-request'

import { ChainEnum } from '../utils/chain'
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

export type Campaign = {
  id: string
  name: string
  chainId: string
  juniorMultiplier: number
  seniorMultiplier: number
  lockupPeriodMonths: number
  poolAddress: string
  campaignGroupId: string
  poolInfo: PoolInfoV2
  partner?: CampaignPartner | null
  multiplierRange?: string
}

export type CampaignGroup = {
  id: string
  name: string
  campaigns: Campaign[]
  partners: CampaignPartner[]
}

type Wallet = {
  id: string
  address: string
  referralCode: string
  referrer: {
    id: string
    address: string
  }
  createdAt: string
}

type WalletPoint = {
  id: string
  rank: number
  wallet: Wallet
  totalPoints: number
  numberOfReferred: number
}

type WalletRank = {
  totalCount: number
  walletPoints: WalletPoint[]
}

type CampaignPoints = {
  campaignId: string
  juniorTranchePoints: number
  seniorTranchePoints: number
  lockupPeriodMonths: number
}

function checkWalletOwnership(wallet: string): Promise<boolean | undefined> {
  const url = configUtil.getCampaignAPIUrl()

  const query = gql`
    query {
      walletOwnership(address: "${wallet}")
    }
  `

  return (
    requestPost(url, JSON.stringify({ query }))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((res: any) => {
        if (res.errors) {
          console.error(res.errors)
          return undefined
        }
        return res.data.walletOwnership
      })
      .catch((err) => {
        console.error(err)
        return undefined
      })
  )
}

function getWalletInfo(
  wallet: string,
): Promise<{ wallet: Wallet; walletPoint: WalletPoint } | undefined> {
  const url = configUtil.getCampaignAPIUrl()

  const query = gql`
    query {
        wallet(address:"${wallet}") {
          id
          address
          referralCode
        }
        walletPoint(address:"${wallet}") {
          rank
          numberOfReferred
          totalPoints
        }
      }
  `

  return (
    requestPost(url, JSON.stringify({ query }))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((res: any) => {
        if (res.errors) {
          console.error(res.errors)
          return undefined
        }
        return res.data
      })
      .catch((err) => {
        console.error(err)
        return undefined
      })
  )
}

function getWalletRankList(
  first: number,
  skip: number,
): Promise<WalletRank | undefined> {
  const url = configUtil.getCampaignAPIUrl()

  const query = gql`
    query {
        walletPoints(first: ${first}, skip: ${skip}){
          totalCount
          walletPoints {
            id
            rank
            wallet {
              id 
              address
            }
            totalPoints
            numberOfReferred
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
          return undefined
        }
        return res.data.walletPoints
      })
      .catch((err) => {
        console.error(err)
        return undefined
      })
  )
}

function getRecentJoins(): Promise<Wallet[] | undefined> {
  const url = configUtil.getCampaignAPIUrl()
  const query = gql`
    query {
      wallets(first: 5, skip: 0, orderBy: "createdAt", orderDirection: "desc") {
        wallets {
          id
          address
          referrer {
            id
            address
          }
          createdAt
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
          return undefined
        }
        return res.data.wallets?.wallets
      })
      .catch((err) => {
        console.error(err)
        return undefined
      })
  )
}

function getActiveSeasonAndCampaignGroups(): Promise<{
  activeSeason: CampaignSeason
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

function getEstimatedPoints(
  campaignGroupId: string,
  principal: string,
): Promise<CampaignPoints[]> {
  const url = configUtil.getCampaignAPIUrl()

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

  return (
    requestPost(url, JSON.stringify({ query }))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((res: any) => {
        if (res.errors) {
          console.error(res.errors)
          return []
        }
        return res.data.calculateEstimatedPoints.campaignPointsEstimations
      })
      .catch((err) => {
        console.error(err)
        return []
      })
  )
}

function createNewWallet(
  account: string,
  referralCode?: string | null | undefined,
): Promise<{ address: string }> {
  const url = configUtil.getCampaignAPIUrl()

  const query = gql`
    mutation {
      createWallet(
        input: {
          walletAddress: "${account}"
          referralCode: "${referralCode}"
        }
      ) {
        ... on CreateWalletResult {
          wallet {
            address
          }
        }
        ... on WalletExistsError {
          message
        }
        ... on UnauthorizedError {
          message
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
): Promise<{ pointsAccumulated: number }> {
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
          pointsAccumulated
        }
        ... on UnauthorizedError {
          message
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
  checkWalletOwnership,
  getWalletInfo,
  getWalletRankList,
  getRecentJoins,
  getActiveSeasonAndCampaignGroups,
  getEstimatedPoints,
  createNewWallet,
  updateWalletPoints,
}
