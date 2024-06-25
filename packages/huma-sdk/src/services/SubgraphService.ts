import {
  CreditEvent,
  POOL_NAME,
  POOL_TYPE,
  PoolContractMap,
  PoolSubgraphMap,
  RealWorldReceivableInfoBase,
  CHAIN_POOLS_INFO_V2,
  ChainEnum,
  isV2Pool,
  requestPost,
} from '@huma-finance/shared'
import { gql } from 'graphql-request'

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

  return (
    requestPost(url, JSON.stringify({ query }))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((res: any) => {
        if (res.errors) {
          console.error(res.errors)
          return []
        }
        return res.data.creditEvents
      })
      .catch((err) => {
        console.error(err)
        return []
      })
  )
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
  const url = PoolSubgraphMap[chainId]?.subgraph
  if (!url) {
    return Promise.resolve([])
  }

  let poolAddress = PoolContractMap[chainId]?.[poolType]?.[poolName]?.pool
  if (!poolAddress) {
    poolAddress = CHAIN_POOLS_INFO_V2[chainId as ChainEnum]?.[poolName]?.pool
  }

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
  })
    .then((res) => {
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
    .catch((err) => {
      console.error(err)
      return []
    })
}

/**
 * Returns if user has borrow or lend history.
 *
 * @memberof SubgraphService
 * @param {number} chainId - The ID of the chain.
 * @param {string} pool - The address of the pool.
 * @param {string} userAddress - The address of the user.
 * @returns {Promise<{hasBorrowHistory: boolean, hasLendHistory: boolean}>} If user has borrow or lend history.
 */
function checkBorrowAndLendHistory(
  chainId: number,
  pool: string,
  userAddress: string,
): Promise<{ hasBorrowHistory: boolean; hasLendHistory: boolean } | undefined> {
  const url = PoolSubgraphMap[chainId]?.subgraph
  if (!url || !userAddress || !pool) {
    return Promise.resolve(undefined)
  }

  let borrowAndLendHistoryQuery = `
  query {
    creditEvents(
      where: {
        owner: "${userAddress.toLowerCase()}",
        pool: "${pool.toLowerCase()}",
      }
    ) {
      event
    }
  }
`

  if (isV2Pool(chainId, pool)) {
    borrowAndLendHistoryQuery = `
    query {
      creditEvents(
        where: {
          owner: "${userAddress.toLowerCase()}",
          pool: "${pool.toLowerCase()}",
        }
        ) {
          event
        }
        lenders(
          where: {
            owner: "${userAddress.toLowerCase()}",
            pool: "${pool.toLowerCase()}"
          }
          ) {
            id
            tranche {
              id
              type
            }
          }
        }
        `
  }

  return requestPost<{
    errors?: unknown
    data: {
      creditEvents: {
        pool: string
        event: number
      }[]
      lenders: { id: string; tranche: { id: string; type: number } }[]
    }
  }>(url, JSON.stringify({ query: borrowAndLendHistoryQuery }), {
    withCredentials: false,
  })
    .then((res) => {
      if (res.errors) {
        console.error(res.errors)
        return undefined
      }
      const { creditEvents = [], lenders = [] } = res.data
      const hasBorrowHistory = creditEvents.some((creditEvent) =>
        [
          CreditEvent.DrawdownMade,
          CreditEvent.DrawdownMadeWithReceivable,
        ].includes(creditEvent.event),
      )
      let hasLendHistory = creditEvents.some(
        (creditEvent) => creditEvent.event === CreditEvent.LiquidityDeposited,
      )
      if (!hasLendHistory) {
        const firstLossCoverTrancheType = 2
        hasLendHistory = lenders.some(
          (lender) => lender.tranche.type !== firstLossCoverTrancheType,
        )
      }
      return { hasBorrowHistory, hasLendHistory }
    })
    .catch((err) => {
      console.error(err)
      return undefined
    })
}

export type V2PoolData = {
  pools: {
    address: string
    version: number
    availableBalanceForPool: string
    apr: number
    yieldInBps: number
    currentEpochEndTime: string
    rewardRateInBpsForPoolOwner: number
    rewardRateInBpsForEA: number
    liquidityCap: string
    maxSeniorJuniorRatio: number
    fixedSeniorYieldInBps: number
    tranchesRiskAdjustmentInBps: number
    withdrawalLockoutInDays: number
  }[]
  tranches: {
    pool: {
      id: string
    }
    type: number
    totalAssets: string
    unprocessedTrancheProfit: string
    minLiquidity: string
    maxLiquidity: string
    riskYieldMultiplierInBps: number
    flcIndex: number
  }[]
  protocolStats: {
    protocolFeeInBps: number
  }
  poolStats: {
    id: string
    amountCreditOriginated: number
    amountCreditRepaid: number
    amountCreditDefaulted: number
  }[]
}

function fetchAllPoolsData(chainId: number): Promise<V2PoolData | undefined> {
  const url = PoolSubgraphMap[chainId]?.subgraph
  if (!url) {
    return Promise.resolve(undefined)
  }

  // Query for all pools
  const QUERY = gql`
    query {
      pools {
        address
        version
        availableBalanceForPool
        apr
        yieldInBps
        currentEpochEndTime
        rewardRateInBpsForPoolOwner
        rewardRateInBpsForEA
        liquidityCap
        maxSeniorJuniorRatio
        fixedSeniorYieldInBps
        tranchesRiskAdjustmentInBps
        withdrawalLockoutInDays
      }
      tranches {
        type
        pool {
          id
        }
        totalAssets
        unprocessedTrancheProfit
        minLiquidity
        maxLiquidity
        riskYieldMultiplierInBps
        flcIndex
      }
      poolStats {
        id
        amountCreditOriginated
        amountCreditRepaid
        amountCreditDefaulted
      }
      protocolStats(id: "protocol-stats") {
        protocolFeeInBps
      }
    }
  `

  return requestPost<{
    errors?: unknown
    data: V2PoolData
  }>(url, JSON.stringify({ query: QUERY }), {
    withCredentials: false,
  })
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

export type AccountData = {
  creditlines: {
    correction: number
    dueDate: number
    creditLineType: number
    billRefreshDate: number
    feesAndInterestDue: number
    missedPeriods: number
    owner: string
    pool: string
    poolEntity: {
      id: string
      version: number
    }
    remainingPeriods: number
    state: number
    totalDue: number
    totalPastDue: number
    unbilledPrincipal: number
    settlementState: number
    committedAmount: number
    receivableAddress: string
    receivableParam: string
  }[]
  lenders: {
    owner: string
    pool: string
    poolEntity: {
      id: string
      version: number
    }
    withdrawableFunds: number
    tranche: {
      type: number
    }
    amount: number
    shares: number
    reinvestYield: boolean
    state: number
  }[]
}

function fetchAllAccountData(
  chainId: number,
  account: string,
): Promise<AccountData | undefined> {
  const url = PoolSubgraphMap[chainId]?.subgraph
  if (!url) {
    return Promise.resolve(undefined)
  }

  const QUERY = gql`
    query {
      creditLines(where: { owner: "${account}" }){
        correction
        dueDate
        creditLineType
        billRefreshDate
        feesAndInterestDue
        missedPeriods
        owner
        pool
        poolEntity {
          id
          version
        }
        remainingPeriods
        state
        totalDue
        totalPastDue
        unbilledPrincipal
        settlementState
        committedAmount
        receivableAddress
        receivableParam
      }
      lenders(where: { owner: "${account}" }){
        owner
        pool
        poolEntity {
          id
          version
        }
        withdrawableFunds
        tranche {
          type
        }
        amount
        shares
        reinvestYield
        state
      }
    }
  `

  return requestPost<{
    errors?: unknown
    data: AccountData
  }>(url, JSON.stringify({ query: QUERY }), {
    withCredentials: false,
  })
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

/**
 * An object that contains functions to interact with Huma's Subgraph storage.
 * @namespace SubgraphService
 */
export const SubgraphService = {
  getSubgraphUrlForChainId,
  getCreditEventsForUser,
  getLastFactorizedAmountFromPool,
  getRWReceivableInfo,
  checkBorrowAndLendHistory,
  fetchAllPoolsData,
  fetchAllAccountData,
}
