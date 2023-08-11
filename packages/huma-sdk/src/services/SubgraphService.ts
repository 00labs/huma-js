import {
  CreditEvent,
  PoolContractMap,
  POOL_NAME,
  POOL_TYPE,
  requestPost,
} from '@huma-finance/shared'

/**
 * Returns the subgraph URL for a given chain ID.
 *
 * @memberof SubgraphService
 * @param {number} chainId - The ID of the chain.
 * @returns {string} The subgraph URL for the given chain ID.
 */
function getSubgraphUrlForChainId(chainId: number): string {
  switch (chainId) {
    case 5:
      return 'https://api.thegraph.com/subgraphs/name/00labs/huma-goerli'
    case 137:
      return 'https://api.thegraph.com/subgraphs/name/00labs/huma-polygon'
    case 80001:
      return 'https://api.thegraph.com/subgraphs/name/00labs/huma-mumbai'
    default:
      return ''
  }
}

/**
 * Represents the payload of a credit event.
 * @typedef {Object} CreditEventPayload
 */
export type CreditEventPayload = {
  amount?: string
  timestamp?: string
  owner?: string
  pool?: string
  event?: string
}

/**
 * Returns the credit events for a given user.
 *
 * @memberof SubgraphService
 * @param {string} userAddress - The address of the user.
 * @param {number} chainId - The ID of the chain.
 * @param {POOL_NAME} poolName - The name of the pool.
 * @param {POOL_TYPE} poolType - The type of the pool.
 * @param {number[]} event - The event types to filter by.
 * @returns {Promise<CreditEventPayload[]>} The credit events for the given user.
 */
function getCreditEventsForUser(
  userAddress: string,
  chainId: number,
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  event: number[],
): Promise<CreditEventPayload[]> {
  const url = getSubgraphUrlForChainId(chainId)
  if (!url) {
    return Promise.resolve([])
  }

  const poolAddress = PoolContractMap[chainId]?.[poolType]?.[poolName]?.pool

  const query = `
    query {
      creditEvents(
        where: {
          owner: "${userAddress}",
          pool: "${poolAddress}",
          event_in: [${event.join(',')}]
        }
        orderBy: timestamp
        orderDirection: desc
      ) {
        amount
        timestamp
        owner
        pool
        event
      }
    }
  `

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return requestPost(url, JSON.stringify({ query })).then((res: any) => {
    if (res.errors) {
      console.error(res.errors)
      return []
    }
    return res.data.creditEvents
  })
}

/**
 * Returns the last factorized amount for a given user and pool.
 *
 * @memberof SubgraphService
 * @param {string} userAddress - The address of the user.
 * @param {number} chainId - The ID of the chain.
 * @param {POOL_NAME} poolName - The name of the pool.
 * @param {POOL_TYPE} poolType - The type of the pool.
 * @returns {Promise<number>} The last factorized amount for the given user and pool.
 */
function getLastFactorizedAmountFromPool(
  userAddress: string,
  chainId: number,
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
): Promise<number> {
  return getCreditEventsForUser(userAddress, chainId, poolName, poolType, [
    CreditEvent.DrawdownMadeWithReceivable,
  ]).then((events) => Number(events[0].amount))
}

/**
 * An object that contains functions to interact with Huma's Subgraph storage.
 * @namespace SubgraphService
 */
export const SubgraphService = {
  getSubgraphUrlForChainId,
  getCreditEventsForUser,
  getLastFactorizedAmountFromPool,
}
