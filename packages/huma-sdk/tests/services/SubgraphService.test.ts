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
  PoolSubgraphMap: {
    137: {
      subgraph: 'https://api.thegraph.com/subgraphs/name/00labs/huma-polygon',
      receivablesSubgraph:
        'https://api.thegraph.com/subgraphs/name/00labs/huma-receivables-polygon',
    },
    5: {
      subgraph: 'https://api.thegraph.com/subgraphs/name/00labs/huma-goerli',
      receivablesSubgraph:
        'https://api.thegraph.com/subgraphs/name/00labs/huma-receivables-goerli',
    },
    80001: {
      subgraph: 'https://api.thegraph.com/subgraphs/name/00labs/huma-mumbai',
      receivablesSubgraph:
        'https://api.thegraph.com/subgraphs/name/00labs/huma-receivables-mumbai',
    },
    44787: {
      subgraph: 'https://api.thegraph.com/subgraphs/name/00labs/huma-alfajores',
      receivablesSubgraph:
        'https://api.thegraph.com/subgraphs/name/00labs/huma-receivables-alfajores',
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
    expect(SubgraphService.getSubgraphUrlForChainId(44787)).toEqual(
      'https://api.thegraph.com/subgraphs/name/00labs/huma-alfajores',
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

describe('getRWReceivableInfo', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should return empty array if no subgraph url is found', async () => {
    const userAddress = '0x123'
    const chainId = 12 // ChainId without receivables Subgraph url
    const poolName = POOL_NAME.HumaCreditLine
    const poolType = POOL_TYPE.CreditLine

    const result = await SubgraphService.getRWReceivableInfo(
      userAddress,
      chainId,
      poolName,
      poolType,
    )
    expect(result).toStrictEqual([])
  })

  it('should return empty array if requestPost returns error', async () => {
    ;(requestPost as jest.Mock).mockResolvedValue({ errors: 'errors' })

    const userAddress = '0x123'
    const chainId = ChainEnum.Goerli
    const poolName = POOL_NAME.HumaCreditLine
    const poolType = POOL_TYPE.CreditLine

    const result = await SubgraphService.getRWReceivableInfo(
      userAddress,
      chainId,
      poolName,
      poolType,
    )
    expect(result).toStrictEqual([])
  })

  it('should return rwreceivables infos', async () => {
    const rwreceivables = [
      {
        tokenId: '1',
        poolAddress: 'pool address',
        receivableAmount: 10,
        paidAmount: 10,
        creationDate: 1234567890,
        maturityDate: 1234567890,
        currencyCode: 1,
        tokenURI: 'https://arweave.net/tx1',
      },
    ]
    ;(requestPost as jest.Mock).mockResolvedValue({
      data: {
        rwreceivables,
      },
    })

    const userAddress = '0x123'
    const chainId = ChainEnum.Goerli
    const poolName = POOL_NAME.HumaCreditLine
    const poolType = POOL_TYPE.CreditLine

    const result = await SubgraphService.getRWReceivableInfo(
      userAddress,
      chainId,
      poolName,
      poolType,
    )
    expect(result).toStrictEqual(rwreceivables)
  })
})

describe('getRWReceivableInfoTotalCount', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should return 0 if no subgraph url is found', async () => {
    const userAddress = '0x123'
    const chainId = 12 // ChainId without receivables Subgraph url
    const poolName = POOL_NAME.HumaCreditLine
    const poolType = POOL_TYPE.CreditLine

    const result = await SubgraphService.getRWReceivableInfoTotalCount(
      userAddress,
      chainId,
      poolName,
      poolType,
    )
    expect(result).toStrictEqual(0)
  })

  it('should return 0 if requestPost returns error', async () => {
    ;(requestPost as jest.Mock).mockResolvedValue({ errors: 'errors' })

    const userAddress = '0x123'
    const chainId = ChainEnum.Goerli
    const poolName = POOL_NAME.HumaCreditLine
    const poolType = POOL_TYPE.CreditLine

    const result = await SubgraphService.getRWReceivableInfoTotalCount(
      userAddress,
      chainId,
      poolName,
      poolType,
    )
    expect(result).toStrictEqual(0)
  })

  it('should return total count of rwreceivables infos', async () => {
    const rwreceivables = [
      {
        tokenId: '1',
        poolAddress: 'pool address',
        receivableAmount: 10,
        paidAmount: 10,
        creationDate: 1234567890,
        maturityDate: 1234567890,
        currencyCode: 1,
        tokenURI: 'https://arweave.net/tx1',
      },
    ]
    ;(requestPost as jest.Mock).mockResolvedValue({
      data: {
        rwreceivables,
      },
    })

    const userAddress = '0x123'
    const chainId = ChainEnum.Goerli
    const poolName = POOL_NAME.HumaCreditLine
    const poolType = POOL_TYPE.CreditLine

    const result = await SubgraphService.getRWReceivableInfoTotalCount(
      userAddress,
      chainId,
      poolName,
      poolType,
    )
    expect(result).toStrictEqual(1)
  })
})
