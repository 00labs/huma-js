/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChainEnum } from '../../src/utils/chain'
import {
  POOL_NAME,
  POOL_TYPE,
  getPoolInfo,
  getPoolInfoForPoolAddress,
  usePools,
} from '../../src/utils/pool'

describe('getPoolInfo', () => {
  it('returns default if chainId is undefined', () => {
    const poolInfo = getPoolInfo(
      undefined,
      POOL_TYPE.Stream,
      POOL_NAME.Superfluid,
    )
    expect(poolInfo?.pool).toBe('0xF713B5203Cb6f3223830De218c2ed89Ee654b94B')
  })

  it('returns null if poolType or poolName is not found', () => {
    expect(
      getPoolInfo(
        ChainEnum.Polygon,
        'InvalidPoolType' as any,
        POOL_NAME.Superfluid,
      ),
    ).toBeNull()
    expect(
      getPoolInfo(
        ChainEnum.Polygon,
        POOL_TYPE.Stream,
        'InvalidPoolName' as any,
      ),
    ).toBeNull()
  })

  it('returns the pool info if chainId, poolType, and poolName are valid', () => {
    const poolInfo = getPoolInfo(
      ChainEnum.Goerli,
      POOL_TYPE.CreditLine,
      POOL_NAME.HumaCreditLine,
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
