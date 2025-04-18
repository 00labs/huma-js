/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChainEnum } from '../../src/utils/chain'
import {
  POOL_NAME,
  POOL_TYPE,
  getPoolInfo,
  getPoolInfoForPoolAddress,
  isPoolName,
} from '../../src/utils/pool'

describe('getPoolInfo', () => {
  it('returns undefined if chainId is undefined', () => {
    expect(
      getPoolInfo(undefined, POOL_NAME.Superfluid, POOL_TYPE.Stream),
    ).toBeUndefined()
  })

  it('returns undefined if poolType or poolName is not found', () => {
    expect(
      getPoolInfo(
        ChainEnum.Polygon,
        POOL_NAME.Superfluid,
        'InvalidPoolType' as any,
      ),
    ).toBeUndefined()
    expect(
      getPoolInfo(
        ChainEnum.Polygon,
        'InvalidPoolName' as any,
        POOL_TYPE.Stream,
      ),
    ).toBeUndefined()
  })

  it('returns the pool info if chainId, poolType, and poolName are valid', () => {
    const poolInfo = getPoolInfo(
      ChainEnum.Polygon,
      POOL_NAME.Jia,
      POOL_TYPE.CreditLine,
    )
    expect(poolInfo?.pool).toBe('0xe8926aDbFADb5DA91CD56A7d5aCC31AA3FDF47E5')
  })
})

test('getPoolInfoForPoolAddress', () => {
  let poolInfo = getPoolInfoForPoolAddress(
    ChainEnum.Polygon,
    '0xe8926aDbFADb5DA91CD56A7d5aCC31AA3FDF47E5',
  )

  expect(poolInfo?.poolName).toBe(POOL_NAME.Jia)

  poolInfo = getPoolInfoForPoolAddress(
    ChainEnum.Polygon,
    '0x0000000000000000000000000000000000000000',
  )

  expect(poolInfo).toBeNull()
})

describe('isPoolName', () => {
  it('should return true for valid poolName', () => {
    expect(isPoolName('ImpactMarket')).toBe(true)
    expect(isPoolName('Superfluid')).toBe(true)
  })

  it('should return false for invalid poolName', () => {
    expect(isPoolName('InvalidPool')).toBe(false)
    expect(isPoolName(undefined)).toBe(false)
  })
})
