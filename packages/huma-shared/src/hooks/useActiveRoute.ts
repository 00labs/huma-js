import { useMemo } from 'react'
import { matchPath, useLocation } from 'react-router-dom'

export const useActiveRoute = (routes: {
  [page: string]: {
    path: string
  }
}): Partial<{
  path: string
  isRoot?: boolean | undefined
}> => {
  const location = useLocation()
  const activeRoute = useMemo(
    () =>
      Object.values(routes).find(
        (route) =>
          !!matchPath(location.pathname, { path: route.path, exact: true }),
      ),
    [location.pathname, routes],
  )

  return activeRoute ?? {}
}
