/* eslint-disable @typescript-eslint/no-explicit-any */
import { act, renderHook, waitFor } from '@testing-library/react'
import { BigNumber } from 'ethers'

import { useContract } from '../../../src/hooks'
import {
  useContractValueV2,
  useLenderApprovedV2,
  useLenderPositionV2,
  usePoolInfoV2,
  usePoolSafeTotalAssetsV2,
} from '../../../src/v2/hooks/usePool'

jest.mock('../../../src/utils/web3', () => ({
  getContract: jest.fn(),
}))

jest.mock('../../../src/v2/utils/pool', () => ({
  POOLS_INFO_V2: {
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

jest.mock('../../../src/hooks', () => ({
  ...jest.requireActual('../../../src/hooks'),
  useContract: jest.fn(),
  useERC20Contract: jest.fn(),
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
      underlyingToken: {
        address: '0x6Dfb932F9fDd38E4B3D2f6AAB0581a05a267C13C',
        symbol: 'USDC',
        decimals: 18,
        icon: 'USDC',
      },
    })
  })

  it('should return undefined for an invalid chainId', () => {
    const invalidChainId = -1
    const result = usePoolInfoV2('HumaCreditLineV2' as any, invalidChainId)
    expect(result).toBeUndefined()
  })

  it('should return undefined for an invalid poolName', () => {
    const chainId = 5
    const result = usePoolInfoV2('invalidPoolName' as any, chainId)
    expect(result).toBeUndefined()
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

describe('usePoolSafeTotalAssetsV2', () => {
  it('should return the total assets value and refresh function', async () => {
    const chainId = 5
    ;(useContract as jest.Mock).mockReturnValue({
      totalAssets: jest.fn().mockResolvedValueOnce(BigNumber.from(100)),
    })

    const { result } = renderHook(() =>
      usePoolSafeTotalAssetsV2('HumaCreditLineV2' as any, chainId, []),
    )

    await waitFor(() => {
      expect(result.current[0]).toEqual(BigNumber.from(100))
    })
    await waitFor(() => {
      expect(typeof result.current[1]).toBe('function')
    })
  })
})

describe('useLenderApprovedV2', () => {
  it('should return the senior/junior balances value and refresh function', async () => {
    const chainId = 5
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
        chainId,
        [],
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
    const chainId = 5
    const account = '0x123'
    ;(useContract as jest.Mock).mockReturnValue({
      balanceOf: jest.fn().mockResolvedValueOnce(BigNumber.from(100)),
    })

    const { result } = renderHook(() =>
      useLenderPositionV2(
        'HumaCreditLineV2' as any,
        'senior',
        account,
        chainId,
        [],
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
