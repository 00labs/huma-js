import { useEffect, useState } from 'react'

export const useDebouncedValue = (
  value: number | string = '',
  delay = 500,
): string | number => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
