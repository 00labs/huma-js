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

type Partner = {
  id: string
  name: string
  multiplier: number
}

type CampaignGroup = {
  id: string
  name: string
  campaigns: Campaign[]
  partners: Partner[]
}

type Campaign = {
  id: string
  name: string
  chainId: string
  juniorMultiplier: number
  seniorMultiplier: number
  lockupPeriodMonths: number
  poolAddress: string
  campaignGroupId?: string
  referenceCode?: string | null
  poolInfo?: PoolInfoV2 | null
  partner?: Partner | null
  multiplierRange?: string
}

function getActiveSeasonAndCampaignGroups(): Promise<{
  activeSeason: Season
  campaignGroups: CampaignGroup[]
}> {
  return {
    activeSeason: {
      id: '3707fd7d-79f7-46fe-959c-94c2ad101ef5',
      estimatedTotalPoints: 1000000,
      name: 'Season 1',
    },
    campaignGroups: [
      {
        id: 'b12f81f5-b51d-4283-81e2-aacf7a7b1ae6',
        name: 'Arf Credit Line Pools',
        campaigns: [
          {
            id: 'b1e4b684-638e-4165-b87f-c3ddb3d6cf42',
            name: 'Arf Credit Line Pools - Campaign Lockup 3 months',
            chainId: 84532,
            juniorMultiplier: 2,
            lockupPeriodMonths: 3,
            seniorMultiplier: 4,
            poolAddress: '0x3e7Cb3f245bdC1BeEe925a2E11c20492553DBE15',
          },
          {
            id: '14059536-2c9a-4212-814a-36ed0e05c334',
            name: 'Arf Credit Line Pools - Campaign Lockup 6 months',
            chainId: 84532,
            juniorMultiplier: 3,
            lockupPeriodMonths: 6,
            seniorMultiplier: 5,
            poolAddress: '0x3611037825B538e0EE0b48D48BAaAEc7d24486Ac',
          },
        ],
        partners: [
          {
            id: '1',
            name: 'Scroll',
          },
        ],
      },
    ],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any

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

  const random = Number((Math.random() * 10).toFixed(0)) + 1

  return [
    {
      campaignId: 'b1e4b684-638e-4165-b87f-c3ddb3d6cf42',
      juniorTranchePoints: 20000 * random,
      seniorTranchePoints: 30000 * random,
      lockupPeriodMonths: 3,
    },
    {
      campaignId: '14059536-2c9a-4212-814a-36ed0e05c334',
      juniorTranchePoints: 40000 * random,
      seniorTranchePoints: 50000 * random,
      lockupPeriodMonths: 6,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ] as any

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { pointAccumulated: 10000 } as any

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
  getActiveSeasonAndCampaignGroups,
  getEstimatedPoints,
  createNewWallet,
  updateWalletPoints,
}
