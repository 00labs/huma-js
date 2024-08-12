import { renderHook } from '@testing-library/react'
import { useLocation } from 'react-router-dom'

import { useActiveRoute } from '../../src/hooks/useActiveRoute'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}))

describe('useActiveRoute', () => {
  it('returns the active route', () => {
    const routes = {
      home: { path: '/' },
      about: { path: '/about' },
    }
    ;(useLocation as jest.Mock).mockReturnValue({ pathname: '/about' })

    const { result } = renderHook(() => useActiveRoute(routes))

    expect(result.current).toEqual(routes.about)
  })

  it('returns an empty object if no route matches', () => {
    const routes = {
      home: { path: '/' },
      about: { path: '/about' },
    }
    ;(useLocation as jest.Mock).mockReturnValue({ pathname: '/nonexistent' })

    const { result } = renderHook(() => useActiveRoute(routes))

    expect(result.current).toEqual({})
  })
})
