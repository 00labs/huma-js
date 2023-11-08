/* eslint-disable @typescript-eslint/no-explicit-any */
import { JsonRpcProvider } from '@ethersproject/providers'
import { act, renderHook, waitFor } from '@testing-library/react'
import { BigNumber } from 'ethers'

import {
  useContractValueV2,
  useFirstLossCoverContractV2,
  useLenderApprovedV2,
  useLenderPositionV2,
  usePoolInfoV2,
  usePoolSafeAllowanceV2,
  usePoolUnderlyingTokenBalanceV2,
  usePoolUnderlyingTokenContractV2,
  useTrancheVaultContractV2,
} from '../../../src/v2/hooks/usePool'
import { useContract, useERC20Contract } from '../../../src/hooks'

jest.mock('../../../src/hooks/useContract', () => ({
  useContract: jest.fn(),
  useERC20Contract: jest.fn(),
}))

jest.mock('../../../src/v2/utils/pool', () => ({
  ...jest.requireActual('../../../src/v2/utils/pool'),
  CHAIN_POOLS_INFO_V2: {
    5: {
      HumaCreditLineV2: {
        pool: '0x3Dd5829A0A20229a18553AAf09415E6139EbC5b9',
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

describe('usePoolInfoV2', () => {
  it('should return the poolInfo for a valid poolName and chainId', () => {
    const chainId = 5
    const result = usePoolInfoV2('HumaCreditLineV2' as any, chainId)
    expect(result).toEqual({
      pool: '0x3Dd5829A0A20229a18553AAf09415E6139EbC5b9',
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

  it('should return undefined for an invalid chainId', () => {
    const invalidChainId = -1
    const result = usePoolInfoV2(
      'HumaCreditLineV2' as any,
      invalidChainId as any,
    )
    expect(result).toBeUndefined()
  })

  it('should return undefined for an invalid poolName', () => {
    const chainId = 5
    const result = usePoolInfoV2('invalidPoolName' as any, chainId)
    expect(result).toBeUndefined()
  })
})

describe('useTrancheVaultContractV2', () => {
  it('returns null if provider is undefined', async () => {
    ;(useContract as jest.Mock).mockReturnValue(null)

    const { result } = renderHook(() =>
      useTrancheVaultContractV2('HumaCreditLineV2' as any, 'senior', undefined),
    )

    await waitFor(() => {
      expect(result.current).toBeNull()
    })
  })

  it('returns tranche vault contract correctly', async () => {
    ;(useContract as jest.Mock).mockReturnValue({
      totalAssets: jest.fn().mockResolvedValueOnce(BigNumber.from(100)),
    })

    const { result } = renderHook(() =>
      useTrancheVaultContractV2('HumaCreditLineV2' as any, 'senior', {
        network: { chainId: 5 },
      } as any),
    )

    await waitFor(() => {
      expect(result.current?.totalAssets).toBeDefined()
    })
  })
})

describe('useFirstLossCoverContractV2', () => {
  it('returns null if provider is undefined', async () => {
    ;(useContract as jest.Mock).mockReturnValue(null)

    const { result } = renderHook(() =>
      useFirstLossCoverContractV2('HumaCreditLineV2' as any, 0, undefined),
    )

    await waitFor(() => {
      expect(result.current).toBeNull()
    })
  })

  it('returns first loss cover contract correctly', async () => {
    ;(useContract as jest.Mock)
      .mockReturnValueOnce({
        getFirstLossCover: jest.fn().mockResolvedValueOnce('0x123'),
      })
      .mockReturnValueOnce({
        poolConfig: jest.fn().mockResolvedValue('0x123456'),
      })
      .mockReturnValueOnce({
        calcLossCover: jest.fn(),
      })

    const { result } = renderHook(() =>
      useFirstLossCoverContractV2('HumaCreditLineV2' as any, 0, {
        network: { chainId: 5 },
      } as any),
    )

    await waitFor(() => {
      expect(result.current?.calcLossCover).toBeDefined()
    })
  })
})

describe('useContractValueV2', () => {
  it('returns default value if contract is not valid', async () => {
    const { result } = renderHook(() => useContractValueV2(null, 'method'))

    await waitFor(() => {
      expect(result.current[0]).toBeUndefined()
    })
  })

  it('Should return value by function call', async () => {
    const contract = {
      method: jest
        .fn()
        .mockResolvedValueOnce(BigNumber.from(100))
        .mockResolvedValueOnce(BigNumber.from(200)),
    }

    const { result } = renderHook(() =>
      useContractValueV2(contract as any, 'method'),
    )

    await waitFor(() => {
      expect(result.current[0]).toEqual(BigNumber.from(100))
    })

    act(() => {
      result.current[1]()
    })

    await waitFor(() => {
      expect(result.current[0]).toEqual(BigNumber.from(200))
    })
  })

  it('Should return value by function call with params', async () => {
    const methodCall = jest.fn().mockImplementation((params) => {
      if (params === 'account') {
        return BigNumber.from(100)
      }
      return BigNumber.from(200)
    })
    const contract = {
      method: methodCall,
    }
    const params = 'account'

    const { result } = renderHook(() =>
      useContractValueV2(contract as any, 'method', params),
    )

    await waitFor(() => {
      expect(result.current[0]).toEqual(BigNumber.from(100))
    })
    expect(methodCall).toBeCalledWith(params)
  })
})

describe('useLenderApprovedV2', () => {
  it('should return the senior/junior balances value and refresh function', async () => {
    const account = '0x123'
    ;(useContract as jest.Mock).mockReturnValue({
      LENDER_ROLE: jest.fn().mockReturnValue('LENDER_ROLE'),
      hasRole: jest
        .fn()
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true),
    })

    const { result } = renderHook(() =>
      useLenderApprovedV2(
        'HumaCreditLineV2' as any,
        'senior',
        account,
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current[0]).toBe(false)
    })
    act(() => {
      result.current[1]()
    })
    await waitFor(() => {
      expect(result.current[0]).toBe(true)
    })
  })
})

describe('useLenderPositionV2', () => {
  it('should return the lender position value and refresh function', async () => {
    const account = '0x123'
    ;(useContract as jest.Mock).mockReturnValue({
      balanceOf: jest.fn().mockResolvedValueOnce(BigNumber.from(100)),
    })

    const { result } = renderHook(() =>
      useLenderPositionV2(
        'HumaCreditLineV2' as any,
        'senior',
        account,
        new JsonRpcProvider(),
      ),
    )

    await waitFor(() => {
      expect(result.current[0]).toEqual(BigNumber.from(100))
    })
    await waitFor(() => {
      expect(typeof result.current[1]).toBe('function')
    })
  })
})

describe('usePoolUnderlyingTokenContractV2', () => {
  it('returns null if provider is undefined', async () => {
    ;(useContract as jest.Mock).mockReturnValue(null)
    ;(useERC20Contract as jest.Mock).mockReturnValue(null)

    const { result } = renderHook(() =>
      usePoolUnderlyingTokenContractV2('HumaCreditLineV2' as any, undefined),
    )

    await waitFor(() => {
      expect(result.current).toBeNull()
    })
  })

  it('returns pool underlying token contract correctly', async () => {
    ;(useContract as jest.Mock).mockReturnValue({
      poolConfig: jest.fn().mockResolvedValue('0x123456'),
      underlyingToken: jest.fn().mockResolvedValue('0x123'),
    })
    ;(useERC20Contract as jest.Mock).mockReturnValue({
      symbol: 'USDC',
      decimals: 18,
    })

    const { result } = renderHook(() =>
      usePoolUnderlyingTokenContractV2(
        'HumaCreditLineV2' as any,
        {
          network: { chainId: 5 },
        } as any,
      ),
    )

    await waitFor(() => {
      expect(result.current).toEqual({
        symbol: 'USDC',
        decimals: 18,
      })
    })
  })
})

describe('usePoolSafeAllowanceV2', () => {
  it('returns 0 if provider is undefined', async () => {
    ;(useContract as jest.Mock).mockReturnValue(null)
    ;(useERC20Contract as jest.Mock).mockReturnValue(null)

    const { result } = renderHook(() =>
      usePoolSafeAllowanceV2('HumaCreditLineV2' as any, 'account', undefined),
    )

    await waitFor(() => {
      expect(result.current[0]).toEqual(BigNumber.from(0))
    })
  })

  it('returns pool safe allowance correctly', async () => {
    ;(useContract as jest.Mock).mockReturnValue({
      poolConfig: jest.fn().mockResolvedValue('0x123456'),
      underlyingToken: jest.fn().mockResolvedValue('0x123'),
    })
    ;(useERC20Contract as jest.Mock).mockReturnValue({
      allowance: jest.fn().mockResolvedValue(BigNumber.from(100)),
    })

    const { result } = renderHook(() =>
      usePoolSafeAllowanceV2('HumaCreditLineV2' as any, 'account', {
        network: { chainId: 5 },
      } as any),
    )

    await waitFor(() => {
      expect(result.current[0]).toEqual(BigNumber.from(100))
    })
  })
})

describe('usePoolUnderlyingTokenBalanceV2', () => {
  it('returns 0 if provider is undefined', async () => {
    ;(useContract as jest.Mock).mockReturnValue(null)
    ;(useERC20Contract as jest.Mock).mockReturnValue(null)

    const { result } = renderHook(() =>
      usePoolUnderlyingTokenBalanceV2(
        'HumaCreditLineV2' as any,
        'account',
        undefined,
      ),
    )

    await waitFor(() => {
      expect(result.current[0]).toEqual(BigNumber.from(0))
    })
  })

  it('returns underlying token balance correctly', async () => {
    ;(useContract as jest.Mock).mockReturnValue({
      poolConfig: jest.fn().mockResolvedValue('0x123456'),
      underlyingToken: jest.fn().mockResolvedValue('0x123'),
    })
    ;(useERC20Contract as jest.Mock).mockReturnValue({
      balanceOf: jest.fn().mockResolvedValue(BigNumber.from(100)),
    })

    const { result } = renderHook(() =>
      usePoolUnderlyingTokenBalanceV2('HumaCreditLineV2' as any, 'account', {
        network: { chainId: 5 },
      } as any),
    )

    await waitFor(() => {
      expect(result.current[0]).toEqual(BigNumber.from(100))
    })
  })
})
