import {
  ChainEnum,
  CreditEvent,
  POOL_NAME,
  POOL_TYPE,
  requestPost,
  isV2Pool,
} from '@huma-finance/shared'

import { SubgraphService } from '../../src/services/SubgraphService'

jest.mock('@huma-finance/shared', () => ({
  ...jest.requireActual('@huma-finance/shared'),
  requestPost: jest.fn(),
  isV2Pool: jest.fn(),
}))

describe('getSubgraphUrlForChainId', () => {
  it('should return the correct subgraph URL for a given chain ID', () => {
    expect(SubgraphService.getSubgraphUrlForChainId(ChainEnum.Polygon)).toEqual(
      'https://api.studio.thegraph.com/query/38092/huma-polygon/version/latest',
    )
    expect(SubgraphService.getSubgraphUrlForChainId(ChainEnum.Celo)).toEqual(
      'https://api.studio.thegraph.com/query/38092/huma-celo/version/latest',
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

describe('getPoolStats', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should return undefined if no subgraph url is found', async () => {
    const chainId = 12 // ChainId without receivables Subgraph url
    const pool = '0xc866A11cf6A3D178624Ff46B8A49202206A7c51B'

    const result = await SubgraphService.getPoolStats(chainId, pool)
    expect(result).toStrictEqual(undefined)
  })

  it('should return undefined if requestPost returns error', async () => {
    ;(requestPost as jest.Mock).mockResolvedValue({ errors: 'errors' })

    const chainId = ChainEnum.Goerli
    const pool = '0xc866A11cf6A3D178624Ff46B8A49202206A7c51B'

    const result = await SubgraphService.getPoolStats(chainId, pool)
    expect(result).toStrictEqual(undefined)
  })

  it('should return pool stats', async () => {
    const pool = '0xc866A11cf6A3D178624Ff46B8A49202206A7c51B'
    const poolStat = {
      id: pool,
      amountCreditOriginated: 300,
      amountCreditRepaid: 400,
      amountCreditDefaulted: 500,
    }
    ;(requestPost as jest.Mock).mockResolvedValue({
      data: {
        poolStat,
      },
    })

    const chainId = ChainEnum.Goerli

    const result = await SubgraphService.getPoolStats(chainId, pool)
    expect(result).toStrictEqual(poolStat)
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
