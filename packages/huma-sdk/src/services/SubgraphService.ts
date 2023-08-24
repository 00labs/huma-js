import {
  CreditEvent,
  PoolContractMap,
  POOL_NAME,
  POOL_TYPE,
  requestPost,
  PoolSubgraphMap,
  RealWorldReceivableInfoBase,
} from '@huma-finance/shared'

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
 * Represents the pagination options for a query.
 * @typedef {Object} Pagination
 */
export type Pagination = {
  first: number | null
  skip: number | null
  orderBy: string
  orderDirection: 'desc' | 'asc'
}

/**
 * Returns the subgraph URL for a given chain ID.
 *
 * @memberof SubgraphService
 * @param {number} chainId - The ID of the chain.
 * @returns {string} The subgraph URL for the given chain ID.
 */
function getSubgraphUrlForChainId(chainId: number): string {
  return PoolSubgraphMap[chainId]?.subgraph ?? ''
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
 * Returns the paginated real world receivables' info.
 *
 * @memberof SubgraphService
 * @param {string} userAddress - The address of the user.
 * @param {number} chainId - The ID of the chain.
 * @param {POOL_NAME} poolName - The name of the pool.
 * @param {POOL_TYPE} poolType - The type of the pool.
 * @param {Pagination} pagination - The pagination option.
 * @returns {Promise<RealWorldReceivableInfoBase>} The paginated real world receivables' info.
 */
function getRWReceivableInfo(
  userAddress: string,
  chainId: number,
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  pagination: Pagination = {
    first: null,
    skip: null,
    orderBy: 'tokenId',
    orderDirection: 'desc',
  },
): Promise<RealWorldReceivableInfoBase[]> {
  let url = PoolSubgraphMap[chainId]?.receivablesSubgraph
  if (!url) {
    return Promise.resolve([])
  }

  // TODO: remove this once the subgraph is updated
  url =
    'https://api.thegraph.com/subgraphs/name/shan-57blocks/huma-polygon-test'

  const poolAddress = PoolContractMap[chainId]?.[poolType]?.[poolName]?.pool

  const RWReceivablesQuery = `
  query {
    rwreceivables(
      where: {
        owner: "${userAddress}",
        pool: "${poolAddress}",
      }
      first: ${pagination.first}
      skip: ${pagination.skip}
      orderBy: "${pagination.orderBy}"
      orderDirection: "${pagination.orderDirection}"
    ) {
      id
      tokenId
      receivableAmount
      paidAmount
      owner
      pool
      maturityDate
      currencyCode
      tokenUri
      status
    }
  }
`

  return requestPost<{
    errors?: unknown
    data: {
      rwreceivables: Array<
        RealWorldReceivableInfoBase & { pool: string; tokenUri: string }
      >
    }
  }>(url, JSON.stringify({ query: RWReceivablesQuery }), {
    withCredentials: false,
  }).then((res) => {
    if (res.errors) {
      console.error(res.errors)
      return []
    }
    return res.data.rwreceivables.map((item) => {
      item.poolAddress = item.pool
      item.tokenURI = item.tokenUri
      return item
    })
  })
}

/**
 * Returns the total count of real world receivables' info.
 *
 * @memberof SubgraphService
 * @param {string} userAddress - The address of the user.
 * @param {number} chainId - The ID of the chain.
 * @param {POOL_NAME} poolName - The name of the pool.
 * @param {POOL_TYPE} poolType - The type of the pool.
 * @returns {Promise<number>} The total count of real world receivables' info.
 */
function getRWReceivableInfoTotalCount(
  userAddress: string,
  chainId: number,
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
): Promise<number> {
  let url = PoolSubgraphMap[chainId]?.receivablesSubgraph
  if (!url) {
    return Promise.resolve(0)
  }

  // TODO: remove this once the subgraph is updated
  url =
    'https://api.thegraph.com/subgraphs/name/shan-57blocks/huma-polygon-test'

  const poolAddress = PoolContractMap[chainId]?.[poolType]?.[poolName]?.pool

  const RWReceivableTotalCountQuery = `
  query {
    rwreceivables(
      where: {
        owner: "${userAddress}",
        pool: "${poolAddress}",
      }
    ) {
      id
    }
  }
`

  return requestPost<{
    errors?: unknown
    data: {
      rwreceivables: Array<RealWorldReceivableInfoBase>
    }
  }>(url, JSON.stringify({ query: RWReceivableTotalCountQuery }), {
    withCredentials: false,
  }).then((res) => {
    if (res.errors) {
      console.error(res.errors)
      return 0
    }
    return res.data.rwreceivables.length
  })
}

/**
 * An object that contains functions to interact with Huma's Subgraph storage.
 * @namespace SubgraphService
 */
export const SubgraphService = {
  getSubgraphUrlForChainId,
  getCreditEventsForUser,
  getLastFactorizedAmountFromPool,
  getRWReceivableInfo,
  getRWReceivableInfoTotalCount,
}
