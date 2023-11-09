/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChainEnum } from '../../src/utils/chain'
import {
  POOL_NAME,
  POOL_TYPE,
  getPoolInfo,
  getPoolInfoForPoolAddress,
  isPoolName,
  usePools,
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
      ChainEnum.Goerli,
      POOL_NAME.HumaCreditLine,
      POOL_TYPE.CreditLine,
    )
    expect(poolInfo?.pool).toBe('0xA22D20FB0c9980fb96A9B0B5679C061aeAf5dDE4')
  })
})

describe('usePools', () => {
  it('returns default chain pools if chainId is undefined', () => {
    const pools = usePools(undefined)
    expect(Array.isArray(pools)).toBe(true)
    expect(pools.length).toBeGreaterThan(0)
  })

  it('returns an array of pool objects sorted by order', () => {
    const chainId = ChainEnum.Mumbai
    const pools = usePools(chainId)
    expect(pools).toBeDefined()
    expect(Array.isArray(pools)).toBe(true)
    expect(pools.length).toBeGreaterThan(0)
    expect(pools[0].poolName).toBeDefined()
    expect(pools[0].poolType).toBeDefined()
  })
})

test('getPoolInfoForPoolAddress', () => {
  let poolInfo = getPoolInfoForPoolAddress(
    ChainEnum.Goerli,
    '0x11672c0bBFF498c72BC2200f42461c0414855042',
  )

  expect(poolInfo?.poolName).toBe(POOL_NAME.RequestNetwork)

  poolInfo = getPoolInfoForPoolAddress(
    ChainEnum.Goerli,
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
