import { renderHook } from '@testing-library/react'
import { useLocation } from 'react-router'

import { useParamsSearch } from '../../src/hooks/useParamsSearch'

jest.mock('react-router', () => ({
  useLocation: jest.fn(),
}))

describe('useParamsSearch', () => {
  it('returns an empty object if location.search is not provided', () => {
    ;(useLocation as jest.Mock).mockReturnValue({})

    const { result } = renderHook(() => useParamsSearch())

    expect(result.current).toEqual({})
  })

  it('returns the parsed query parameters if location.search is provided', () => {
    ;(useLocation as jest.Mock).mockReturnValue({
      search: '?param1=value1&param2=value2',
    })

    const { result } = renderHook(() => useParamsSearch())

    expect(result.current).toEqual({ param1: 'value1', param2: 'value2' })
  })
})
