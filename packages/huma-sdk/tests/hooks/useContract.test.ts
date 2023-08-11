import { renderHook } from '@testing-library/react'
import { ethers } from 'ethers'

import { useContract } from '../../src/hooks/useContract'

describe('useContract', () => {
  it('should return null if address is not provided', () => {
    const mockABI = [{ name: 'method', type: 'function' }]
    const mockSignerOrProvider = new ethers.providers.JsonRpcProvider()

    const { result } = renderHook(() =>
      useContract(null, mockABI, mockSignerOrProvider),
    )
    expect(result.current).toBeNull()
  })

  it('should return null if ABI is not provided', () => {
    const mockAddress = '0x123'
    const mockSignerOrProvider = new ethers.providers.JsonRpcProvider()

    const { result } = renderHook(() =>
      useContract(mockAddress, null, mockSignerOrProvider),
    )

    expect(result.current).toBeNull()
  })

  it('should return null if signerOrProvider is not provided', () => {
    const mockAddress = '0x123'
    const mockABI = [{ name: 'method', type: 'function' }]

    // @ts-ignore
    const { result } = renderHook(() => useContract(mockAddress, mockABI, null))

    expect(result.current).toBeNull()
  })

  it('should return null if an error occurs', () => {
    const mockAddress = '0x123'
    const mockABI = [{ name: 'method', type: 'function' }]
    const mockSignerOrProvider = new ethers.providers.JsonRpcProvider()

    const { result } = renderHook(() =>
      useContract(mockAddress, mockABI, mockSignerOrProvider),
    )

    expect(result.current).toBeNull()
  })

  it('should return the contract instance', () => {
    const mockAddress = '0x3c352ea32dfbb757ccdf4b457e52daf6ecc21917'
    const mockABI = [{ name: 'method', type: 'function' }]
    const mockSignerOrProvider = new ethers.providers.JsonRpcProvider()

    const { result } = renderHook(() =>
      useContract(mockAddress, mockABI, mockSignerOrProvider),
    )

    expect(result.current).toBeDefined()
  })
})
