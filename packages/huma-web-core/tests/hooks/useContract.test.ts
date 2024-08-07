/* eslint-disable @typescript-eslint/no-explicit-any */
import { AddressZero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider } from '@ethersproject/providers'
import { getContract } from '@huma-shan/core'
import { renderHook } from '@testing-library/react'

import { useContract, useMultiSendContract } from '../../src/hooks/useContract'

jest.mock('@ethersproject/providers')

jest.mock('@huma-shan/core', () => ({
  ...jest.requireActual('@huma-shan/core'),
  getContract: jest.fn(),
  SupplementaryContracts: {
    MultiSend: 'MultiSend',
  },
  SupplementaryContractsMap: {
    1: {
      MultiSend: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    },
  },
}))

describe('useContract', () => {
  it('returns null if address is not provided', () => {
    const { result } = renderHook(() =>
      useContract(undefined, [], new JsonRpcProvider()),
    )

    expect(result.current).toBeNull()
  })

  it('returns null if address is zero address', () => {
    const { result } = renderHook(() =>
      useContract(AddressZero, [], new JsonRpcProvider()),
    )

    expect(result.current).toBeNull()
  })

  it('returns null if ABI is not provided', () => {
    const { result } = renderHook(() =>
      useContract('0x123', undefined, new JsonRpcProvider()),
    )

    expect(result.current).toBeNull()
  })

  it('returns null if provider is not provided', () => {
    const { result } = renderHook(() => useContract('0x123', [], undefined))

    expect(result.current).toBeNull()
  })

  it('returns the contract if all parameters are provided', () => {
    const mockContract = new Contract(
      '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      [],
    )
    ;(getContract as jest.Mock).mockReturnValue(mockContract)

    const { result } = renderHook(() =>
      useContract(
        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        [],
        new JsonRpcProvider(),
      ),
    )

    expect(result.current).toEqual(mockContract)
  })

  it('returns null if getContract throws an error', () => {
    ;(getContract as jest.Mock).mockImplementation(() => {
      throw new Error()
    })

    const { result } = renderHook(() =>
      useContract('0x0', [], new JsonRpcProvider()),
    )

    expect(result.current).toBeNull()
  })
})

describe('useMultiSendContract', () => {
  it('returns null if chainId is not provided', () => {
    ;(getContract as jest.Mock).mockReturnValue(null)

    const { result } = renderHook(() =>
      useMultiSendContract(1, new JsonRpcProvider()),
    )

    expect(result.current).toBeNull()
  })

  it('returns the contract if chainId is provided', () => {
    const mockContract = new Contract(
      '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      [],
    )
    ;(getContract as jest.Mock).mockReturnValue(mockContract)

    const { result } = renderHook(() =>
      useMultiSendContract(1, new JsonRpcProvider()),
    )

    expect(result.current).toBe(mockContract)
  })
})
