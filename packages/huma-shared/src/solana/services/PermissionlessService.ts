import { gql } from 'graphql-request'
import {
  COMMON_ERROR_MESSAGE,
  configUtil,
  NETWORK_TYPE,
  requestPost,
} from 'src/utils'

export interface PermissionlessRewardsMetadata {
  feathersPerHumaToken: string
  usdPerFeather: string
}

export interface PermissionlessUserFeathersBoosters {
  og?: number
  community?: number
  vanguard?: number
  anchor?: number
}

function getPermissionlessRewardsMetadata(
  networkType: NETWORK_TYPE,
  isDev: boolean,
): Promise<PermissionlessRewardsMetadata | undefined> {
  const url = configUtil.getPermissionlessAPIUrl(networkType, isDev)

  const query = gql`
    query Query {
      apy {
        ... on ApyResult {
          feathersPerHumaToken
          usdPerFeather
        }
        ... on PermissionlessGraphqlError {
          errMessage
        }
      }
    }
  `

  return requestPost<{
    data?: {
      apy: { data: PermissionlessRewardsMetadata } & { errMessage: string }
    }
    errors?: unknown
  }>(url, JSON.stringify({ query }))
    .then((res) => {
      if (res.errors) {
        console.log(res.errors)
        throw new Error(COMMON_ERROR_MESSAGE)
      }
      const errMessage = res.data?.apy?.errMessage
      if (errMessage) {
        console.error(errMessage)
        throw new Error(errMessage)
      }

      return res.data?.apy.data
    })
    .catch((err) => {
      return {
        feathersPerHumaToken: '30.00',
        usdPerFeather: '0.000973086493476',
      }

      console.error(err)
      throw new Error(COMMON_ERROR_MESSAGE)
    })
}

function getUserFeathersBoosters(
  networkType: NETWORK_TYPE,
  isDev: boolean,
): Promise<PermissionlessUserFeathersBoosters | undefined> {
  const url = configUtil.getPermissionlessAPIUrl(networkType, isDev)

  const query = gql`
    query Query {
      accountMultiplier {
        ... on AccountMultiplierResult {
          og
          community
        }
        ... on PermissionlessGraphqlError {
          errMessage
        }
      }
    }
  `

  return requestPost<{
    data?: {
      accountMultiplier: PermissionlessUserFeathersBoosters & {
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
      const errMessage = res.data?.accountMultiplier?.errMessage
      if (errMessage) {
        console.error(errMessage)
        throw new Error(errMessage)
      }

      const { og, community, vanguard, anchor } =
        res.data?.accountMultiplier || {}
      return {
        og: Number(og || 1),
        community: Number(community || 1),
        vanguard: Number(vanguard || 1),
        anchor: Number(anchor || 1),
      }
    })
    .catch((err) => {
      return {
        og: 1,
        community: 1,
        vanguard: 1,
        anchor: 1,
      }

      console.error(err)
      throw new Error(COMMON_ERROR_MESSAGE)
    })
}

export const PermissionlessService = {
  getPermissionlessRewardsMetadata,
  getUserFeathersBoosters,
}
