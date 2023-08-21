import { act, renderHook, waitFor } from '@testing-library/react'
import { useWeb3React } from '@web3-react/core'
import { BigNumber, Contract } from 'ethers'

import {
  useInvoiceNFTContract,
  useNFTIds,
} from '../../src/hooks/useInvoiceNFTContract'
import { POOL_NAME } from '../../src/utils/pool'
import { getContract } from '../../src/utils/web3'

jest.mock('@web3-react/core', () => ({
  useWeb3React: jest.fn(),
}))

jest.mock('../../src/utils/web3', () => ({
  getContract: jest.fn(),
}))

jest.mock('../../src/utils/pool', () => ({
  POOL_NAME: {
    RequestNetwork: 'RequestNetwork',
    HumaCreditLine: 'HumaCreditLine',
  },
  POOL_TYPE: {
    Invoice: 'Invoice',
  },
  PoolContractMap: {
    1: {
      Invoice: {
        RequestNetwork: {
          assetAddress: '0x0',
        },
      },
    },
  },
}))

describe('useInvoiceNFTContract', () => {
  it('returns null if chainId is not provided', () => {
    ;(useWeb3React as jest.Mock).mockReturnValue({})

    const { result } = renderHook(() =>
      useInvoiceNFTContract(POOL_NAME.RequestNetwork),
    )

    expect(result.current).toBeNull()
  })

  it('returns null if chainId is not supported', () => {
    ;(useWeb3React as jest.Mock).mockReturnValue({
      chainId: 11,
    })

    const { result } = renderHook(() =>
      useInvoiceNFTContract(POOL_NAME.RequestNetwork),
    )

    expect(result.current).toBeNull()
  })

  it('returns the contract if chainId is provided', () => {
    ;(useWeb3React as jest.Mock).mockReturnValue({
      provider: 'provider',
      chainId: 1,
    })
    const mockContract = new Contract(
      '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      [],
    )
    ;(getContract as jest.Mock).mockReturnValue(mockContract)

    const { result } = renderHook(() =>
      useInvoiceNFTContract(POOL_NAME.RequestNetwork),
    )

    expect(result.current).not.toBeNull()
  })
})

describe('useNFTIds', () => {
  it('returns undefined if pool name is not correct', () => {
    ;(useWeb3React as jest.Mock).mockReturnValue({
      provider: 'provider',
      chainId: 1,
    })
    const { result } = renderHook(() => useNFTIds(POOL_NAME.HumaCreditLine))

    expect(result.current[0]).toBeUndefined()
  })

  it('returns undefined if account is not provided', () => {
    ;(useWeb3React as jest.Mock).mockReturnValue({
      provider: 'provider',
      account: 'account',
      chainId: 1,
    })
    const mockContract = new Contract(
      '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      [],
    )
    ;(getContract as jest.Mock).mockReturnValue(mockContract)
    const { result } = renderHook(() => useNFTIds(POOL_NAME.RequestNetwork, ''))

    expect(result.current[0]).toBeUndefined()
  })

  it('returns the token ids if pool name and account are provided', async () => {
    ;(useWeb3React as jest.Mock).mockReturnValue({
      provider: 'provider',
      account: 'account',
      chainId: 1,
    })
    const mockContract = {
      getTokenIds: jest.fn().mockResolvedValue([BigNumber.from(1)]),
    }
    ;(getContract as jest.Mock).mockReturnValue(mockContract)
    const { result } = renderHook(() =>
      useNFTIds(POOL_NAME.RequestNetwork, 'account'),
    )

    await waitFor(() => {
      expect(result.current[0]).toEqual([BigNumber.from(1)])
    })
  })

  it('refreshes the token ids when the refresh function is called', async () => {
    ;(useWeb3React as jest.Mock).mockReturnValue({
      provider: 'provider',
      account: 'account',
      chainId: 1,
    })

    const mockContract = {
      getTokenIds: jest
        .fn()
        .mockResolvedValueOnce([BigNumber.from(1)])
        .mockResolvedValueOnce([BigNumber.from(2)]),
    }
    ;(getContract as jest.Mock).mockReturnValue(mockContract)
    const { result } = renderHook(() =>
      useNFTIds(POOL_NAME.RequestNetwork, 'account'),
    )

    await waitFor(() => {
      expect(result.current[0]).toEqual([BigNumber.from(1)])
    })

    act(() => {
      result.current[1]()
    })

    await waitFor(() => {
      expect(result.current[0]).toEqual([BigNumber.from(2)])
    })
  })
})
