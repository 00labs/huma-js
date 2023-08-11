import {
  ChainEnum,
  POOL_NAME,
  POOL_TYPE,
  requestPost,
} from '@huma-finance/shared'

import { SubgraphService } from '../../src/services/SubgraphService'

jest.mock('@huma-finance/shared', () => ({
  ChainEnum: {
    Goerli: 5,
  },
  POOL_NAME: {
    Arf: 'Arf',
  },
  POOL_TYPE: {
    CreditLine: 'CreditLine',
  },
  PoolContractMap: {
    5: {
      CreditLine: {
        Arf: {
          pool: '0x123',
        },
      },
    },
  },
  CreditEvent: { DrawdownMadeWithReceivable: 3 },
  requestPost: jest.fn(),
}))

describe('getSubgraphUrlForChainId', () => {
  it('should return the correct subgraph URL for a given chain ID', () => {
    expect(SubgraphService.getSubgraphUrlForChainId(5)).toEqual(
      'https://api.thegraph.com/subgraphs/name/00labs/huma-goerli',
    )
    expect(SubgraphService.getSubgraphUrlForChainId(137)).toEqual(
      'https://api.thegraph.com/subgraphs/name/00labs/huma-polygon',
    )
    expect(SubgraphService.getSubgraphUrlForChainId(80001)).toEqual(
      'https://api.thegraph.com/subgraphs/name/00labs/huma-mumbai',
    )
    expect(SubgraphService.getSubgraphUrlForChainId(12)).toEqual('')
  })
})

describe('getCreditEventsForUser', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should return empty array if no subgraph url is found', async () => {
    const userAddress = '0x123'
    const chainId = 12 // ChainId without subgraph url
    const poolName = POOL_NAME.HumaCreditLine
    const poolType = POOL_TYPE.CreditLine
    const event = [1, 2, 3]

    const result = await SubgraphService.getCreditEventsForUser(
      userAddress,
      chainId,
      poolName,
      poolType,
      event,
    )
    expect(result).toStrictEqual([])
  })

  it('should return empty array if requestPost returns error', async () => {
    ;(requestPost as jest.Mock).mockResolvedValue({ errors: 'errors' })

    const userAddress = '0x123'
    const chainId = ChainEnum.Goerli
    const poolName = POOL_NAME.HumaCreditLine
    const poolType = POOL_TYPE.CreditLine
    const event = [1, 2, 3]

    const result = await SubgraphService.getCreditEventsForUser(
      userAddress,
      chainId,
      poolName,
      poolType,
      event,
    )
    expect(result).toStrictEqual([])
  })

  it('should return credit events', async () => {
    ;(requestPost as jest.Mock).mockResolvedValue({
      data: {
        creditEvents: [{ value: 1 }],
      },
    })

    const userAddress = '0x123'
    const chainId = ChainEnum.Goerli
    const poolName = POOL_NAME.HumaCreditLine
    const poolType = POOL_TYPE.CreditLine
    const event = [1, 2, 3]

    const result = await SubgraphService.getCreditEventsForUser(
      userAddress,
      chainId,
      poolName,
      poolType,
      event,
    )
    expect(result).toStrictEqual([{ value: 1 }])
  })
})

describe('getLastFactorizedAmountFromPool', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should return last factorized amount from pool', async () => {
    ;(requestPost as jest.Mock).mockResolvedValue({
      data: {
        creditEvents: [{ amount: 6 }, { amount: 7 }, { amount: 8 }],
      },
    })

    const userAddress = '0x123'
    const chainId = ChainEnum.Goerli
    const poolName = POOL_NAME.HumaCreditLine
    const poolType = POOL_TYPE.CreditLine

    const result = await SubgraphService.getLastFactorizedAmountFromPool(
      userAddress,
      chainId,
      poolName,
      poolType,
    )
    expect(result).toStrictEqual(6)
  })
})
