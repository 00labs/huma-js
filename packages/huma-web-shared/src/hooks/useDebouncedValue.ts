import { useEffect, useState } from 'react'

export const useDebouncedValue = <
  T extends number | string | boolean | undefined,
>(
  value: T,
  delay = 500,
): T => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
