import { ChainEnum, POOL_NAME } from '../../../src/utils'
import {
  getChainPoolNamesV2,
  CHAIN_POOLS_INFO_V2,
  getPoolInfoForPoolAddressV2,
} from '../../../src/v2/utils'

jest.mock('../../../src/v2/metadata/Localhost', () => ({
  LOCALHOST_METADATA: {
    JiaV2: {
      poolName: 'JiaV2',
      pool: '0x1fA02b2d6A771842690194Cf62D91bdd92BfE28d',
      estAPY: '10-20%',
      underlyingToken: {
        address: '0x1429859428C0aBc9C2C47C8Ee9FBaf82cFA0F20f',
        symbol: 'USDC',
        decimals: 18,
        icon: 'USDC',
      },
    },
  },
}))

jest.mock('../../../src/v2/metadata/Mumbai', () => ({
  MUMBAI_METADATA: {
    JiaV2: {
      poolName: 'JiaV2',
      pool: '0x3Dd5829A0A20229a18553AAf09415E6139EbC5b9',
      estAPY: '10-20%',
      underlyingToken: {
        address: '0x6Dfb932F9fDd38E4B3D2f6AAB0581a05a267C13C',
        symbol: 'USDC',
        decimals: 18,
        icon: 'USDC',
      },
    },
  },
}))

describe('getPoolsInfoV2', () => {
  it('should return the poolsInfoV2 object', () => {
    const result = CHAIN_POOLS_INFO_V2

    expect(result[ChainEnum.Localhost].JiaV2).toEqual({
      poolName: 'JiaV2',
      pool: '0x1fA02b2d6A771842690194Cf62D91bdd92BfE28d',
      estAPY: '10-20%',
      underlyingToken: {
        address: '0x1429859428C0aBc9C2C47C8Ee9FBaf82cFA0F20f',
        symbol: 'USDC',
        decimals: 18,
        icon: 'USDC',
      },
    })
    expect(result[ChainEnum.Mumbai].JiaV2).toEqual({
      poolName: 'JiaV2',
      pool: '0x3Dd5829A0A20229a18553AAf09415E6139EbC5b9',
      estAPY: '10-20%',
      underlyingToken: {
        address: '0x6Dfb932F9fDd38E4B3D2f6AAB0581a05a267C13C',
        symbol: 'USDC',
        decimals: 18,
        icon: 'USDC',
      },
    })
  })
})

describe('getChainPoolNamesV2', () => {
  it('should return undefined for undefined chainId', () => {
    const chainId = undefined
    const result = getChainPoolNamesV2(chainId)
    expect(result).toBeUndefined()
  })

  it('should return an empty array for invalid chainId', () => {
    const chainId = 999
    const result = getChainPoolNamesV2(chainId)
    expect(result).toEqual([])
  })

  it('should return an array of pool names for valid chainId', () => {
    const result = getChainPoolNamesV2(ChainEnum.Mumbai)

    expect(result).toEqual(['JiaV2'])
  })
})

describe('getPoolInfoForPoolAddressV2', () => {
  it('should return null if chainId not found', () => {
    const chainId = -1
    const poolAddress = '0xa890Ac3c9F8E38Be9c05BFfc0E4ECa21Bbc2FfA9'

    expect(getPoolInfoForPoolAddressV2(chainId, poolAddress)).toBe(null)
  })

  it('should return null if poolAddress not found', () => {
    const chainId = ChainEnum.Mumbai
    const poolAddress = 'wrong pool address'

    expect(getPoolInfoForPoolAddressV2(chainId, poolAddress)).toBe(null)
  })

  it('should return poolInfo', () => {
    const chainId = ChainEnum.Mumbai
    const poolAddress = '0x3Dd5829A0A20229a18553AAf09415E6139EbC5b9'

    expect(getPoolInfoForPoolAddressV2(chainId, poolAddress)?.poolName).toBe(
      POOL_NAME.JiaV2,
    )
  })
})
