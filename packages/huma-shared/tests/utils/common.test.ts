import { isEmpty, openInNewTab, sleep } from '../../src/common/utils/common'

describe('isEmpty', () => {
  it('returns true if the value is undefined', () => {
    const result = isEmpty(undefined)

    expect(result).toBe(true)
  })

  it('returns true if the value is null', () => {
    const result = isEmpty(null)

    expect(result).toBe(true)
  })

  it('returns false if the value is not undefined or null', () => {
    const result = isEmpty('value')

    expect(result).toBe(false)
  })
})

describe('openInNewTab', () => {
  it('open a new tab and focus the new tab', () => {
    const mockFocus = jest.fn()
    window.open = jest.fn().mockReturnValue({ focus: mockFocus })

    openInNewTab('https://example.com')

    expect(window.open).toHaveBeenCalledWith('https://example.com', '_blank')
    expect(mockFocus).toHaveBeenCalled()
  })
})

describe('sleep', () => {
  it('resolves after the specified number of milliseconds', async () => {
    jest.useFakeTimers()
    const promise = sleep(1000)

    jest.advanceTimersByTime(1000)

    await expect(promise).resolves.toBeUndefined()
  })
})
