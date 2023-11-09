/* eslint-disable @typescript-eslint/no-explicit-any */
import { Contract } from '@ethersproject/contracts'
import { renderHook } from '@testing-library/react'
import { AddressZero } from '@ethersproject/constants'
import { JsonRpcProvider } from '@ethersproject/providers'
import { useContract, useMultiSendContract } from '../../src/hooks/useContract'
import { getContract } from '../../src/utils/web3'

jest.mock('@ethersproject/providers')

jest.mock('../../src/utils/web3', () => ({
  ...jest.requireActual('../../src/utils/web3'),
  getContract: jest.fn(),
}))

jest.mock('../../src/utils/pool', () => ({
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
