import { gql } from 'graphql-request'

import { SolanaPoolInfo } from '../solana'
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

interface BaseCampaign {
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

function checkWalletOwnership(
  wallet: string,
  isDev: boolean,
  pointsTestnetExperience: boolean,
): Promise<boolean | undefined> {
  const url = configUtil.getCampaignAPIUrl(isDev, pointsTestnetExperience)

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

function getWalletInfo(
  wallet: string,
  isDev: boolean,
  pointsTestnetExperience: boolean,
): Promise<{ wallet: Wallet; walletPoint: WalletPoint } | undefined> {
  const url = configUtil.getCampaignAPIUrl(isDev, pointsTestnetExperience)

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

  return requestPost<{
    data?: { wallet: Wallet; walletPoint: WalletPoint }
    errors?: unknown
  }>(url, JSON.stringify({ query }))
    .then((res) => {
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
}

function getWalletRankList(
  seasonId: string,
  first: number,
  skip: number,
  isDev: boolean,
  pointsTestnetExperience: boolean,
): Promise<WalletRank | undefined> {
  const url = configUtil.getCampaignAPIUrl(isDev, pointsTestnetExperience)

  const query = gql`
    query {
        walletPoints(
          seasonId: "${seasonId}",
           first: ${first}, 
           skip: ${skip}
           ){
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

  return requestPost<{
    data?: { walletPoints: WalletRank }
    errors?: unknown
  }>(url, JSON.stringify({ query }))
    .then((res) => {
      if (res.errors) {
        console.error(res.errors)
        return undefined
      }
      return res.data?.walletPoints
    })
    .catch((err) => {
      console.error(err)
      return undefined
    })
}

function getRecentJoins(
  isDev: boolean,
  pointsTestnetExperience: boolean,
): Promise<Wallet[] | undefined> {
  const url = configUtil.getCampaignAPIUrl(isDev, pointsTestnetExperience)
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
        return res.data?.wallets?.wallets
      })
      .catch((err) => {
        console.error(err)
        return undefined
      })
  )
}

function getActiveSeasonAndCampaignGroups(
  isDev: boolean,
  pointsTestnetExperience: boolean,
): Promise<{
  activeSeason?: CampaignSeason
  campaignGroups?: CampaignGroup[]
}> {
  const url = configUtil.getCampaignAPIUrl(isDev, pointsTestnetExperience)

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

  return requestPost<{
    data?: {
      activeSeason: CampaignSeason
      campaignGroups: CampaignGroup[]
    }
    errors?: unknown
  }>(url, JSON.stringify({ query }))
    .then((res) => {
      if (res.errors) {
        console.error(res.errors)
        return {}
      }
      return res.data ?? {}
    })
    .catch((err) => {
      console.error(err)
      return {}
    })
}

function getEstimatedPoints(
  campaignGroupId: string,
  principal: string,
  isDev: boolean,
  pointsTestnetExperience: boolean,
): Promise<CampaignPoints[]> {
  const url = configUtil.getCampaignAPIUrl(isDev, pointsTestnetExperience)

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

function createNewWallet(
  account: string,
  referralCode: string | null | undefined,
  isDev: boolean,
  pointsTestnetExperience: boolean,
): Promise<{ wallet: string } | undefined> {
  const url = configUtil.getCampaignAPIUrl(isDev, pointsTestnetExperience)

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

  return requestPost<{
    data?: {
      createWallet?: {
        wallet: string
      }
    }
    errors?: unknown
  }>(url, JSON.stringify({ query }))
    .then((res) => {
      if (res.errors) {
        console.error(res.errors)
        return undefined
      }
      return res.data?.createWallet
    })
    .catch((err) => {
      console.error(err)
      return undefined
    })
}

function updateWalletPoints(
  account: string,
  hash: string,
  chainId: ChainEnum,
  isDev: boolean,
  pointsTestnetExperience: boolean,
): Promise<{ pointsAccumulated?: number }> {
  const url = configUtil.getCampaignAPIUrl(isDev, pointsTestnetExperience)

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

  return requestPost<{
    data?: {
      updateWalletPoints?: { pointsAccumulated?: number }
    }
    errors?: unknown
  }>(url, JSON.stringify({ query }))
    .then((res) => {
      if (res.errors) {
        console.error(res.errors)
        return {}
      }
      return res.data?.updateWalletPoints ?? {}
    })
    .catch((err) => {
      console.error(err)
      return {}
    })
}

async function checkAndCreateWallet(
  account: string,
  referralCode: string | null | undefined,
  isDev: boolean,
  pointsTestnetExperience: boolean,
): Promise<{ wallet: string } | undefined> {
  const result = await getWalletInfo(account, isDev, pointsTestnetExperience)
  if (!result?.wallet) {
    return createNewWallet(
      account,
      referralCode,
      isDev,
      pointsTestnetExperience,
    )
  }
  return undefined
}

/**
 * An object that contains functions to interact with Huma's campaign service.
 * @namespace CampaignService
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
  checkAndCreateWallet,
}
