import { ChainEnum, POOL_NAME, POOL_TYPE } from '@huma-finance/shared'

import { getPoolInfo } from '../../src/utils/poolInfo'

jest.mock('@huma-finance/shared', () => ({
  POOL_NAME: {
    HumaCreditLine: 'HumaCreditLine',
  },
  POOL_TYPE: {
    CreditLine: 'CreditLine',
    Invoice: 'Invoice',
  },
  ChainEnum: {
    Goerli: 5,
  },
  PoolContractMap: {
    5: {
      CreditLine: {
        HumaCreditLine: {
          pool: 'poolAddress',
        },
      },
    },
  },
}))

describe('getPoolInfo', () => {
  test('should return pool info if it exists', () => {
    const result = getPoolInfo(
      ChainEnum.Goerli,
      POOL_NAME.HumaCreditLine,
      POOL_TYPE.CreditLine,
    )

    expect(result).toEqual({
      pool: 'poolAddress',
    })
  })

  test('should return undefined if pool info does not exist', () => {
    const result = getPoolInfo(
      ChainEnum.Goerli,
      POOL_NAME.HumaCreditLine,
      POOL_TYPE.Invoice,
    )

    expect(result).toBeUndefined()
  })
})
