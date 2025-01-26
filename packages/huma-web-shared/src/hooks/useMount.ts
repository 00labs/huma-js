import { useEffect } from 'react'

export const isFunction = (value: unknown): value is Function =>
  typeof value === 'function'

export const useMount = (fn: () => void) => {
  useEffect(() => {
    fn?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
