import { useCallback, useState } from 'react'

/**
 * Throws an error from outside of the React lifecycle.
 * Errors thrown through this method will correctly trigger the ErrorBoundary.
 *
 * @example
 * const throwError = useAsyncError()
 * useEffect(() => {
 *   fetch('http://example.com')
 *     .catch((e: Error) => {
 *       throwError(toWidgetError(e))
 *     })
 * }, [throwError])
 */
export function useAsyncError() {
  const [, setError] = useState()
  return useCallback(
    (error: unknown) =>
      setError(() => {
        if (error instanceof Error) throw error
        throw new Error(error as string)
      }),
    [],
  )
}
