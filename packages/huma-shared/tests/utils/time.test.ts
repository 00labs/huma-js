/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment'
import {
  getUnixTimestamp,
  secondsToDays,
  timestampToLL,
  timestampToStr,
} from '../../src/utils/time'
import { sleep } from '../../src/utils/common'

describe('timestampToStr', () => {
  it('returns the formatted date string based on the given timestamp and format', () => {
    const timestamp = 1636723200 // November 12, 2021

    const result = timestampToStr(timestamp, 'll')
    expect(result).toBe('Nov 12, 2021')
  })
})

describe('timestampToLL', () => {
  it('returns the formatted date string in the "ll" format based on the given timestamp', () => {
    const timestamp = 1636723200 // November 12, 2021

    const result = timestampToLL(timestamp)
    expect(result).toBe('Nov 12, 2021')
  })

  it('returns an empty string if the timestamp is not provided', () => {
    const result = timestampToLL()

    expect(result).toBe('')
  })
})

describe('getUnixTimestamp', () => {
  it('returns the unix timestamp in seconds for the given date', () => {
    const date = moment('2022-11-12 00:00:00')
    const result = getUnixTimestamp(date)
    expect(result).toBe(1668211200 - date.utcOffset() * 60) // November 12, 2022
  })
})

describe('secondsToDays', () => {
  it('returns the number of days when given a valid number of seconds', () => {
    expect(secondsToDays(86400)).toBe(1) // 1 day
    expect(secondsToDays(172800)).toBe(2) // 2 days
    expect(secondsToDays(3600)).toBeCloseTo(0.0417, 4) // Approximately 0.0417 days
  })

  it('returns 0 when given an empty or undefined value', () => {
    expect(secondsToDays(undefined)).toBe(0)
    expect(secondsToDays(null as any)).toBe(0)
    expect(secondsToDays(0)).toBe(0)
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
