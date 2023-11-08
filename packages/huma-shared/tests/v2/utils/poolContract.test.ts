/* eslint-disable @typescript-eslint/no-explicit-any */
import { BigNumber } from 'ethers'

import { getContract, getERC20Contract } from '../../../src/utils'
import {
  getFirstLossCoverAssetsV2,
  getPoolConfigContractV2,
  getPoolInfoV2,
  getPoolUnderlyingTokenContractV2,
  getPoolUnderlyingTokenInfoV2,
  getTrancheVaultAssetsV2,
  getTrancheVaultContractV2,
} from '../../../src/v2/utils'

jest.mock('../../../src/utils/web3', () => ({
  getContract: jest.fn(),
  getERC20Contract: jest.fn(),
}))

jest.mock('../../../src/v2/utils/pool', () => ({
  CHAIN_POOLS_INFO_V2: {
    5: {
      HumaCreditLineV2: {
        pool: '0x3Dd5829A0A20229a18553AAf09415E6139EbC5b9',
        poolConfig: '0x3Dd5829A0A20229a18553AAf09415E6139EbC5b9',
        seniorTrancheVault: '0xAfD360a03aBf192D0F335f24627b5001e2C78fdf',
        juniorTrancheVault: '0x1f10865eF0181D8a7e3d31EcDECA7c615954EfEE',
        estAPY: '10-20%',
        poolUnderlyingToken: {
          address: '0x6Dfb932F9fDd38E4B3D2f6AAB0581a05a267C13C',
          symbol: 'USDC',
          decimals: 18,
          icon: 'USDC',
        },
      },
    },
  },
}))

describe('getPoolInfoV2', () => {
  it('should return the poolInfo for a valid poolName and chainId', () => {
    const chainId = 5
    const result = getPoolInfoV2('HumaCreditLineV2' as any, chainId)
    expect(result).toEqual({
      pool: '0x3Dd5829A0A20229a18553AAf09415E6139EbC5b9',
      poolConfig: '0x3Dd5829A0A20229a18553AAf09415E6139EbC5b9',
      seniorTrancheVault: '0xAfD360a03aBf192D0F335f24627b5001e2C78fdf',
      juniorTrancheVault: '0x1f10865eF0181D8a7e3d31EcDECA7c615954EfEE',
      estAPY: '10-20%',
      poolUnderlyingToken: {
        address: '0x6Dfb932F9fDd38E4B3D2f6AAB0581a05a267C13C',
        symbol: 'USDC',
        decimals: 18,
        icon: 'USDC',
      },
    })
  })

  it('should return null for an invalid chainId', () => {
    const invalidChainId = -1
    const result = getPoolInfoV2('HumaCreditLineV2' as any, invalidChainId)
    expect(result).toBeNull()
  })
})

describe('getPoolConfigContractV2', () => {
  it('should return null if cannot find pool info', async () => {
    const result = await getPoolConfigContractV2(
      'invalidPoolName' as any,
      { network: { chainId: 5 } } as any,
    )
    expect(result).toEqual(null)
  })

  it('should return pool config contract', async () => {
    ;(getContract as jest.Mock).mockReturnValue({
      getFirstLossCover: jest.fn().mockResolvedValueOnce(BigNumber.from(100)),
    })

    const result = await getPoolConfigContractV2(
      'HumaCreditLineV2' as any,
      { network: { chainId: 5 } } as any,
    )
    expect(result?.getFirstLossCover).toBeDefined()
  })
})

describe('getPoolUnderlyingTokenContractV2', () => {
  it('should return null if cannot find pool info', async () => {
    const result = await getPoolUnderlyingTokenContractV2(
      'invalidPoolName' as any,
      { network: { chainId: 5 } } as any,
    )
    expect(result).toEqual(null)
  })

  it('should return pool underlying token contract', async () => {
    ;(getContract as jest.Mock).mockReturnValueOnce({
      underlyingToken: jest
        .fn()
        .mockResolvedValueOnce('0x6Dfb932F9fDd38E4B3D2f6AAB0581a05a267C13C'),
    })
    ;(getERC20Contract as jest.Mock).mockReturnValueOnce({
      symbol: jest.fn().mockResolvedValueOnce('USDC'),
      decimals: jest.fn().mockResolvedValueOnce(18),
    })

    const result = await getPoolUnderlyingTokenContractV2(
      'HumaCreditLineV2' as any,
      { network: { chainId: 5 } } as any,
    )
    expect(result?.symbol).toBeDefined()
  })
})

describe('getTrancheVaultContractV2', () => {
  it('should return null if cannot find pool info', async () => {
    const result = await getTrancheVaultContractV2(
      'invalidPoolName' as any,
      'junior',
      { network: { chainId: 5 } } as any,
    )
    expect(result).toEqual(null)
  })

  it('should return tranche vault contract', async () => {
    ;(getContract as jest.Mock).mockReturnValue({
      getRoleAdmin: jest.fn(),
    })

    const result = await getTrancheVaultContractV2(
      'HumaCreditLineV2' as any,
      'junior',
      { network: { chainId: 5 } } as any,
    )
    expect(result?.getRoleAdmin).toBeDefined()
  })
})

describe('getPoolUnderlyingTokenInfoV2', () => {
  it('should return undefined if cannot find pool info', async () => {
    const result = await getPoolUnderlyingTokenInfoV2(
      'invalidPoolName' as any,
      { network: { chainId: 5 } } as any,
    )
    expect(result).toEqual(undefined)
  })

  it('should return pool underlying token info', async () => {
    ;(getContract as jest.Mock).mockReturnValueOnce({
      underlyingToken: jest
        .fn()
        .mockResolvedValueOnce('0x6Dfb932F9fDd38E4B3D2f6AAB0581a05a267C13C'),
    })
    ;(getERC20Contract as jest.Mock).mockReturnValueOnce({
      address: '0x6Dfb932F9fDd38E4B3D2f6AAB0581a05a267C13C',
      symbol: jest.fn().mockResolvedValueOnce('USDC'),
      decimals: jest.fn().mockResolvedValueOnce(18),
    })

    const result = await getPoolUnderlyingTokenInfoV2(
      'HumaCreditLineV2' as any,
      { network: { chainId: 5 } } as any,
    )
    expect(result).toEqual({
      address: '0x6Dfb932F9fDd38E4B3D2f6AAB0581a05a267C13C',
      symbol: 'USDC',
      decimals: 18,
    })
  })
})

describe('getFirstLossCoverAssetsV2', () => {
  it('should return undefined if cannot find pool info', async () => {
    const result = await getFirstLossCoverAssetsV2(
      'invalidPoolName' as any,
      { network: { chainId: 5 } } as any,
    )
    expect(result).toEqual(undefined)
  })

  it('should return undefined if cannot find pool config contract', async () => {
    ;(getContract as jest.Mock).mockReturnValueOnce(null)

    const result = await getFirstLossCoverAssetsV2(
      'HumaCreditLineV2' as any,
      undefined,
    )
    expect(result).toEqual(undefined)
  })

  it('should return first loss cover assets', async () => {
    ;(getContract as jest.Mock)
      .mockReturnValueOnce({
        getFirstLossCovers: jest
          .fn()
          .mockResolvedValueOnce([
            '0x6Dfb932F9fDd38E4B3D2f6AAB0581a05a267C13C',
            '',
            '0x6Dfb932F9fDd38E4B3D2f6AAB0581a05a267C134',
          ]),
      })
      .mockReturnValueOnce({
        totalAssets: jest.fn().mockResolvedValueOnce(BigNumber.from(100)),
      })
      .mockReturnValueOnce({
        totalAssets: jest.fn().mockResolvedValueOnce(BigNumber.from(200)),
      })
    ;(getERC20Contract as jest.Mock).mockReturnValueOnce({
      address: '0x6Dfb932F9fDd38E4B3D2f6AAB0581a05a267C13C',
      symbol: jest.fn().mockResolvedValueOnce('USDC'),
      decimals: jest.fn().mockResolvedValueOnce(18),
    })

    const result = await getFirstLossCoverAssetsV2(
      'HumaCreditLineV2' as any,
      { network: { chainId: 5 } } as any,
    )
    expect(result).toEqual(BigNumber.from(300))
  })
})

describe('getTrancheVaultAssetsV2', () => {
  it('should return undefined if cannot find pool info', async () => {
    const result = await getTrancheVaultAssetsV2(
      'invalidPoolName' as any,
      'junior',
      { network: { chainId: 5 } } as any,
    )
    expect(result).toEqual(undefined)
  })

  it('should return tranche vault total assets', async () => {
    ;(getContract as jest.Mock).mockReturnValueOnce({
      totalAssets: jest.fn().mockResolvedValueOnce(BigNumber.from(100)),
    })

    const result = await getTrancheVaultAssetsV2(
      'HumaCreditLineV2' as any,
      'junior',
      { network: { chainId: 5 } } as any,
    )
    expect(result).toEqual(BigNumber.from(100))
  })
})
