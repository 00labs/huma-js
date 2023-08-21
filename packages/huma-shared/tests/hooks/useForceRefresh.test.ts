import { act, renderHook } from '@testing-library/react'

import { useForceRefresh } from '../../src/hooks/useForceRefresh'

describe('useForceRefresh', () => {
  it('returns a refresh count and a refresh function', () => {
    const { result } = renderHook(() => useForceRefresh())

    expect(result.current[0]).toBe(0)
    expect(typeof result.current[1]).toBe('function')
  })

  it('increments the refresh count when the refresh function is called', () => {
    const { result } = renderHook(() => useForceRefresh())

    act(() => {
      result.current[1]()
    })

    expect(result.current[0]).toBe(1)
  })
})
