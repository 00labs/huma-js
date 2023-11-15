import { act, renderHook, waitFor } from '@testing-library/react'
import { BigNumber, Contract } from 'ethers'

import { JsonRpcProvider } from '@ethersproject/providers'
import { useContract } from '../../src/hooks/useContract'
import {
  useInvoiceNFTContract,
  useNFTIds,
} from '../../src/hooks/useInvoiceNFTContract'
import { POOL_NAME } from '../../src/utils/pool'

jest.mock('../../src/hooks/useContract', () => ({
  useContract: jest.fn(),
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
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('returns null if chainId is not provided', () => {
    ;(useContract as jest.Mock).mockReturnValue(null)

    const { result } = renderHook(() =>
      useInvoiceNFTContract(
        POOL_NAME.RequestNetwork,
        undefined,
        new JsonRpcProvider(),
      ),
    )

    expect(result.current).toBeNull()
  })

  it('returns null if chainId is not supported', () => {
    ;(useContract as jest.Mock).mockReturnValue(null)

    const { result } = renderHook(() =>
      useInvoiceNFTContract(
        POOL_NAME.RequestNetwork,
        -1,
        new JsonRpcProvider(),
      ),
    )

    expect(result.current).toBeNull()
  })

  it('returns the contract if chainId is provided', () => {
    const mockContract = new Contract(
      '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      [],
    )
    ;(useContract as jest.Mock).mockReturnValue(mockContract)

    const { result } = renderHook(() =>
      useInvoiceNFTContract(POOL_NAME.RequestNetwork, 5, new JsonRpcProvider()),
    )

    expect(result.current).not.toBeNull()
  })
})

describe('useNFTIds', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('returns undefined if pool name is not correct', () => {
    const { result } = renderHook(() =>
      useNFTIds(POOL_NAME.HumaCreditLine, 5, 'account', new JsonRpcProvider()),
    )

    expect(result.current[0]).toBeUndefined()
  })

  it('returns undefined if account is not provided', () => {
    const mockContract = new Contract(
      '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      [],
    )
    ;(useContract as jest.Mock).mockReturnValue(mockContract)
    const { result } = renderHook(() =>
      useNFTIds(POOL_NAME.RequestNetwork, 5, '', new JsonRpcProvider()),
    )

    expect(result.current[0]).toBeUndefined()
  })

  it('returns the token ids if pool name and account are provided', async () => {
    const mockContract = {
      getTokenIds: jest.fn().mockResolvedValue([BigNumber.from(1)]),
    }
    ;(useContract as jest.Mock).mockReturnValue(mockContract)
    const { result } = renderHook(() =>
      useNFTIds(POOL_NAME.RequestNetwork, 5, 'account', new JsonRpcProvider()),
    )

    await waitFor(() => {
      expect(result.current[0]).toEqual([BigNumber.from(1)])
    })
  })

  it('refreshes the token ids when the refresh function is called', async () => {
    const mockContract = {
      getTokenIds: jest
        .fn()
        .mockResolvedValueOnce([BigNumber.from(1)])
        .mockResolvedValueOnce([BigNumber.from(2)]),
    }
    ;(useContract as jest.Mock).mockReturnValue(mockContract)
    const { result } = renderHook(() =>
      useNFTIds(POOL_NAME.RequestNetwork, 5, 'account', new JsonRpcProvider()),
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
