/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, waitFor, act } from '@testing-library/react'
import { useWeb3React } from '@web3-react/core'

import { BigNumber } from 'ethers'
import { useContractValue, usePoolInfoV2 } from '../../../src/v2/hooks/usePool'

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

    const { result } = renderHook(() => useContractValue(undefined, 'method'))

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

    const { result } = renderHook(() => useContractValue(contract, 'method'))

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
})
