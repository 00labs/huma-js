import moment from 'moment'
import { isEmpty } from './common'

export const MILLISECONDS = 1000
export const DAY_SECONDS = 24 * 60 * 60
export const TIME_FORMAT_LL = 'll'

export const timestampToStr = (timestamp: number, format: string) =>
  moment.unix(timestamp).format(format)

/**
 * Convert timestamp to format ll: Nov 12, 2022
 *
 * @param timestamp
 * @returns format ll: Nov 12, 2022
 */
export const timestampToLL = (timestamp?: number) => {
  if (!timestamp) {
    return ''
  }
  return timestampToStr(timestamp, TIME_FORMAT_LL)
}

/**
 * get unix time in seconds
 *
 * @returns timestamp
 */
export const getUnixTimestamp = (date?: moment.Moment) => {
  if (date) {
    return date.unix()
  }
  return Math.floor(Date.now() / MILLISECONDS)
}

/**
 * Given an arbitrary unix timestamp, which may be milliseconds or seconds based,
 * return a unix timestamp in milliseconds.
 *
 * @param {number} unixTimestamp - A unix timestamp, which may be in milliseconds or seconds.
 *
 * @returns
 */
export function convertUnixTimestampToMilliseconds(
  unixTimestamp: number,
): number {
  // Using the length of the string is technically not a safe way to determine
  // if the timestamp is in milliseconds or seconds, but it is good enough for
  // our purposes since we are only concerned with timestamps within reasonable
  // bounds. Assuming a timestamp in milliseconds can only be 13 or more characters
  // long, we'd only miss out on millisecond timestamps that captured before 9/8/2001.
  if (unixTimestamp.toString().length < 13) {
    unixTimestamp = Math.floor(unixTimestamp * 1000)
  }

  return unixTimestamp
}

export const secondsToDays = (seconds: number | undefined) => {
  if (isEmpty(seconds)) {
    return 0
  }
  try {
    return seconds! / DAY_SECONDS
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return 0
  }
}

// eslint-disable-next-line no-promise-executor-return
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const timeUtil = {
  timestampToStr,
  timestampToLL,
  getUnixTimestamp,
  secondsToDays,
  sleep,
}
