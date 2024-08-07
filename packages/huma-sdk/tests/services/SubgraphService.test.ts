import {
  ChainEnum,
  CreditEvent,
  POOL_NAME,
  POOL_TYPE,
  requestPost,
  isV2Pool,
  PoolSubgraphMap,
} from '@huma-shan/core'

import { SubgraphService } from '../../src/services/SubgraphService'

jest.mock('@huma-shan/core', () => ({
  ...jest.requireActual('@huma-shan/core'),
  requestPost: jest.fn(),
  isV2Pool: jest.fn(),
}))

describe('getSubgraphUrlForChainId', () => {
  it('should return the correct subgraph URL for a given chain ID', () => {
    expect(SubgraphService.getSubgraphUrlForChainId(ChainEnum.Polygon)).toEqual(
      PoolSubgraphMap[ChainEnum.Polygon].subgraph,
    )
    expect(SubgraphService.getSubgraphUrlForChainId(ChainEnum.Celo)).toEqual(
      PoolSubgraphMap[ChainEnum.Celo].subgraph,
    )
    expect(SubgraphService.getSubgraphUrlForChainId(12)).toEqual('')
  })

  it('should return the correct subgraph URL if an apiKey is given', () => {
    expect(
      SubgraphService.getSubgraphUrlForChainId(ChainEnum.Polygon, 'apiKey'),
    ).toEqual(
      'https://gateway-arbitrum.network.thegraph.com/api/apiKey/subgraphs/id/GaFTstjPKTju5buJ4TzQ3Zjm3mrmMa5LWvCKu3H7JDeU',
    )
  })

  it('should return the correct subgraph URL if an apiKey is given for a non-production network', () => {
    expect(
      SubgraphService.getSubgraphUrlForChainId(ChainEnum.Amoy, 'apiKey'),
    ).toEqual(PoolSubgraphMap[ChainEnum.Amoy].subgraph)
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

describe('checkBorrowAndLendHistory', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should return undefined if no subgraph url is found', async () => {
    const chainId = 12 // ChainId without receivables Subgraph url
    const pool = '0xc866A11cf6A3D178624Ff46B8A49202206A7c51B'
    const userAddress = '0x123'

    const result = await SubgraphService.checkBorrowAndLendHistory(
      chainId,
      pool,
      userAddress,
    )
    expect(result).toStrictEqual(undefined)
  })

  it('should return undefined if pool is not valid address', async () => {
    const chainId = ChainEnum.Goerli
    const poolNotValid = ''
    const userAddress = '0x0548b2924412Cd85EB91D29772a9b8A9868F6A39'

    const result = await SubgraphService.checkBorrowAndLendHistory(
      chainId,
      poolNotValid,
      userAddress,
    )
    expect(result).toStrictEqual(undefined)
  })

  it('should return undefined if user address is not valid address', async () => {
    const chainId = ChainEnum.Goerli
    const pool = '0x0548b2924412Cd85EB91D29772a9b8A9868F6A39'
    const userAddressNotValid = ''

    const result = await SubgraphService.checkBorrowAndLendHistory(
      chainId,
      pool,
      userAddressNotValid,
    )
    expect(result).toStrictEqual(undefined)
  })

  it('should return undefined if requestPost returns error', async () => {
    ;(requestPost as jest.Mock).mockResolvedValue({ errors: 'errors' })

    const chainId = ChainEnum.Goerli
    const pool = '0xc866A11cf6A3D178624Ff46B8A49202206A7c51B'
    const userAddress = '0x0548b2924412Cd85EB91D29772a9b8A9868F6A39'

    const result = await SubgraphService.checkBorrowAndLendHistory(
      chainId,
      pool,
      userAddress,
    )
    expect(result).toStrictEqual(undefined)
  })

  it('should return if user has borrow history', async () => {
    const pool = '0xc866A11cf6A3D178624Ff46B8A49202206A7c51B'
    const userAddress = '0x0548b2924412Cd85EB91D29772a9b8A9868F6A39'
    ;(requestPost as jest.Mock).mockResolvedValue({
      data: {
        creditEvents: [
          {
            pool,
            event: CreditEvent.DrawdownMade,
          },
        ],
      },
    })
    ;(isV2Pool as jest.Mock).mockResolvedValue(false)

    const chainId = ChainEnum.Goerli

    const result = await SubgraphService.checkBorrowAndLendHistory(
      chainId,
      pool,
      userAddress,
    )
    expect(result).toStrictEqual({
      hasBorrowHistory: true,
      hasLendHistory: false,
    })
  })

  it('should return if user has lend history', async () => {
    const pool = '0xc866A11cf6A3D178624Ff46B8A49202206A7c51B'
    const userAddress = '0x0548b2924412Cd85EB91D29772a9b8A9868F6A39'
    ;(requestPost as jest.Mock).mockResolvedValue({
      data: {
        lenders: [
          {
            id: '0x0548b2924412Cd85EB91D29772a9b8A9868F6A39',
            tranche: {
              type: 0,
            },
          },
        ],
      },
    })
    ;(isV2Pool as jest.Mock).mockResolvedValue(true)

    const chainId = ChainEnum.Goerli

    const result = await SubgraphService.checkBorrowAndLendHistory(
      chainId,
      pool,
      userAddress,
    )
    expect(result).toStrictEqual({
      hasBorrowHistory: false,
      hasLendHistory: true,
    })
  })
})
