import { Contract } from '@ethersproject/contracts'
import { renderHook } from '@testing-library/react'
import { useWeb3React } from '@web3-react/core'

import { useContract, useMultiSendContract } from '../../src/hooks/useContract'
import { getContract } from '../../src/utils/web3'

jest.mock('@web3-react/core', () => ({
  useWeb3React: jest.fn(),
}))

jest.mock('../../src/utils/web3', () => ({
  getContract: jest.fn(),
}))

jest.mock('../../src/utils/pool', () => ({
  SupplementaryContracts: {
    MultiSend: 'MultiSend',
  },
  SupplementaryContractsMap: {
    1: {
      MultiSend: '0x0',
    },
  },
}))

describe('useContract', () => {
  it('returns null if address is not provided', () => {
    ;(useWeb3React as jest.Mock).mockReturnValue({})

    const { result } = renderHook(() => useContract(undefined, []))

    expect(result.current).toBeNull()
  })

  it('returns null if ABI is not provided', () => {
    ;(useWeb3React as jest.Mock).mockReturnValue({})

    const { result } = renderHook(() => useContract('0x123', undefined))

    expect(result.current).toBeNull()
  })

  it('returns null if provider is not provided', () => {
    ;(useWeb3React as jest.Mock).mockReturnValue({
      provider: null,
    })

    const { result } = renderHook(() => useContract('0x123', []))

    expect(result.current).toBeNull()
  })

  it('returns null if chainId is not provided', () => {
    ;(useWeb3React as jest.Mock).mockReturnValue({
      provider: 'provider',
      chainId: null,
    })

    const { result } = renderHook(() => useContract('0x123', []))

    expect(result.current).toBeNull()
  })

  it('returns the contract if all parameters are provided', () => {
    const mockContract = new Contract(
      '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      [],
    )
    ;(useWeb3React as jest.Mock).mockReturnValue({
      provider: {},
      account: '0x0',
      chainId: 1,
    })
    ;(getContract as jest.Mock).mockReturnValue(mockContract)

    const { result } = renderHook(() =>
      useContract('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', [''], true),
    )

    expect(result.current).toEqual(mockContract)
  })

  it('returns null if getContract throws an error', () => {
    ;(useWeb3React as jest.Mock).mockReturnValue({
      provider: {},
      account: '0x0',
      chainId: 1,
    })
    ;(getContract as jest.Mock).mockImplementation(() => {
      throw new Error()
    })

    const { result } = renderHook(() => useContract('0x0', ['mockABI'], true))

    expect(result.current).toBeNull()
  })
})

describe('useMultiSendContract', () => {
  it('returns null if chainId is not provided', () => {
    ;(useWeb3React as jest.Mock).mockReturnValue({})

    const { result } = renderHook(() => useMultiSendContract())

    expect(result.current).toBeNull()
  })

  it('returns the contract if chainId is provided', () => {
    const chainId = 1
    ;(useWeb3React as jest.Mock).mockReturnValue({
      chainId,
      provider: 'provider',
    })

    const mockContract = new Contract(
      '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      [],
    )
    ;(getContract as jest.Mock).mockReturnValue(mockContract)

    const { result } = renderHook(() => useMultiSendContract())

    expect(result.current).not.toBeNull()
  })
})
