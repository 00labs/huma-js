import { act, renderHook, waitFor } from '@testing-library/react'
import { useWeb3React } from '@web3-react/core'

import { useRefresh } from '../../src/hooks/useRefresh'

jest.mock('@web3-react/core', () => ({
  useWeb3React: jest.fn(),
}))

describe('useRefresh', () => {
  it('returns initial state if provider is not provided', () => {
    ;(useWeb3React as jest.Mock).mockReturnValue({
      provider: null,
    })

    const { result } = renderHook(() => useRefresh())

    expect(result.current[1]).toBe(false)
  })

  it('calls the callback function if block number is greater than or equal to target block number', async () => {
    const mockProvider = {
      on: jest.fn(),
      removeListener: jest.fn(),
    }
    ;(useWeb3React as jest.Mock).mockReturnValue({ provider: mockProvider })

    const { result } = renderHook(() => useRefresh())
    const mockCallback = jest.fn()

    act(() => {
      result.current[0](1, mockCallback)
    })

    const listener = mockProvider.on.mock.calls[0][1]
    listener(2)

    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalled()
    })
    await waitFor(() => {
      expect(result.current[1]).toBe(false)
    })
  })

  it('sets loading to true if block number is less than target block number', async () => {
    const mockProvider = {
      on: jest.fn(),
      removeListener: jest.fn(),
    }
    ;(useWeb3React as jest.Mock).mockReturnValue({ provider: mockProvider })

    const { result } = renderHook(() => useRefresh())
    const mockCallback = jest.fn()

    act(() => {
      result.current[0](2, mockCallback)
    })

    const listener = mockProvider.on.mock.calls[0][1]
    listener(1)

    await waitFor(() => {
      expect(mockCallback).not.toHaveBeenCalled()
    })
    await waitFor(() => {
      expect(result.current[1]).toBe(true)
    })
  })
})
