/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, waitFor, act } from '@testing-library/react'
import { useWeb3React } from '@web3-react/core'

import { BigNumber } from 'ethers'
import {
  useContractValue,
  useLenderPositionV2,
  usePoolInfoV2,
  usePoolTotalAssetsV2,
} from '../../../src/v2/hooks/usePool'
import { useContract } from '../../../src/hooks'

jest.mock('@web3-react/core', () => ({
  useWeb3React: jest.fn(),
}))

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
        underlyingToken: {
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
}))

describe('usePoolInfoV2', () => {
  it('should return the poolInfo for a valid poolName and chainId', () => {
    ;(useWeb3React as jest.Mock).mockReturnValue({
      chainId: 5,
    })

    const result = usePoolInfoV2('HumaCreditLineV2' as any)
    expect(result).toEqual({
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

  it('should return undefined for an invalid chainId', () => {
    ;(useWeb3React as jest.Mock).mockReturnValue({
      chainId: -1,
    })

    const result = usePoolInfoV2('HumaCreditLineV2' as any)
    expect(result).toBeUndefined()
  })

  it('should return undefined for an invalid poolName', () => {
    ;(useWeb3React as jest.Mock).mockReturnValue({
      chainId: 5,
    })

    const result = usePoolInfoV2('invalidPoolName' as any)
    expect(result).toBeUndefined()
  })
})

describe('useContractValue', () => {
  it('returns default value if chainId is not valid', async () => {
    ;(useWeb3React as jest.Mock).mockReturnValue({})

    const { result } = renderHook(() => useContractValue({} as any, 'method'))

    await waitFor(() => {
      expect(result.current[0]).toBeUndefined()
    })
  })

  it('returns default value if contract is not valid', async () => {
    ;(useWeb3React as jest.Mock).mockReturnValue({
      chainId: 5,
    })

    const { result } = renderHook(() => useContractValue(null, 'method'))

    await waitFor(() => {
      expect(result.current[0]).toBeUndefined()
    })
  })

  it('Should return value by function call', async () => {
    ;(useWeb3React as jest.Mock).mockReturnValue({
      chainId: 5,
    })
    const contract = {
      method: jest
        .fn()
        .mockResolvedValueOnce(BigNumber.from(100))
        .mockResolvedValueOnce(BigNumber.from(200)),
    }

    const { result } = renderHook(() =>
      useContractValue(contract as any, 'method'),
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
    ;(useWeb3React as jest.Mock).mockReturnValue({
      chainId: 5,
    })
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
      useContractValue(contract as any, 'method', params),
    )

    await waitFor(() => {
      expect(result.current[0]).toEqual(BigNumber.from(100))
    })
    expect(methodCall).toBeCalledWith(params)
  })
})

describe('usePoolTotalAssetsV2', () => {
  it('should return the total assets value and refresh function', async () => {
    ;(useWeb3React as jest.Mock).mockReturnValue({
      chainId: 5,
    })
    ;(useContract as jest.Mock).mockReturnValue({
      totalAssets: jest.fn().mockResolvedValueOnce(BigNumber.from(100)),
    })

    const { result } = renderHook(() =>
      usePoolTotalAssetsV2('HumaCreditLineV2' as any),
    )

    await waitFor(() => {
      expect(result.current[0]).toEqual(BigNumber.from(100))
    })
    await waitFor(() => {
      expect(typeof result.current[1]).toBe('function')
    })
  })
})

describe('useLenderPositionV2', () => {
  it('should return the senior/junior balances value and refresh function', async () => {
    ;(useWeb3React as jest.Mock).mockReturnValue({
      chainId: 5,
      account: 'account',
    })
    ;(useContract as jest.Mock).mockReturnValue({
      balanceOf: jest.fn().mockResolvedValueOnce(BigNumber.from(100)),
    })

    const { result } = renderHook(() =>
      useLenderPositionV2('HumaCreditLineV2' as any),
    )

    await waitFor(() => {
      expect(result.current.seniorBalance).toEqual(BigNumber.from(100))
    })
  })
})
