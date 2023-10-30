import { AddressZero } from '@ethersproject/constants'
import { JsonRpcProvider } from '@ethersproject/providers'
import { renderHook } from '@testing-library/react'

import { Contract } from 'ethers'
import { useContractCrossChain } from '../../src/hooks/useContractCrossChain'

describe('useContract', () => {
  it('returns null if address is not provided', () => {
    const { result } = renderHook(() =>
      useContractCrossChain(undefined, [], new JsonRpcProvider()),
    )

    expect(result.current).toBeNull()
  })

  it('returns null if address is zero address', () => {
    const { result } = renderHook(() =>
      useContractCrossChain(AddressZero, [], new JsonRpcProvider()),
    )

    expect(result.current).toBeNull()
  })

  it('returns null if ABI is not provided', () => {
    const { result } = renderHook(() =>
      useContractCrossChain('0x123', undefined, new JsonRpcProvider()),
    )

    expect(result.current).toBeNull()
  })

  it('returns null if provider is not provided', () => {
    const { result } = renderHook(() =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      useContractCrossChain('0x123', [], null as any),
    )

    expect(result.current).toBeNull()
  })

  it('returns the contract', () => {
    const { result } = renderHook(() =>
      useContractCrossChain(
        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        [],
        new JsonRpcProvider(),
      ),
    )

    expect(result.current).toEqual(expect.any(Contract))
  })
})
