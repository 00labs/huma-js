import { BigNumber, ethers } from 'ethers'
import { isEmpty } from './common'
import { scientificToDecimal } from './scientificToDecimal'

const numberFormatter = new Intl.NumberFormat('en-US')

export const formatMoney = (
  num: number | string | undefined,
  notation?: Intl.NumberFormatOptions['notation'],
) => {
  if (isEmpty(num) || Number.isNaN(num)) {
    return num
  }

  let numCast = Number(num)
  // If num is greater than a certain amount, round out decimals
  if (numCast > 1_000) {
    numCast = Math.round(numCast)
  }

  const moneyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    notation,
  })

  return moneyFormatter.format(numCast)
}

export const formatNumber = (num: number | string | undefined) => {
  if (isEmpty(num) || Number.isNaN(num)) {
    return num
  }

  let numCast = Number(num)
  // If num is greater than a certain amount, round out decimals
  if (numCast > 1_000) {
    numCast = Math.round(numCast)
  }
  return numberFormatter.format(numCast)
}

export const downScale = <T = string>(
  num: string | number | BigNumber,
  decimals?: number,
): T => {
  if (isEmpty(num) || isEmpty(decimals)) {
    return num as T
  }
  if (typeof num === 'string') {
    // eslint-disable-next-line prefer-destructuring
    num = num.split('.')[0]
  }
  const result = ethers.utils.formatUnits(num, decimals)
  if (typeof num === 'number') {
    return Number(result) as T
  }
  return result as T
}

export const upScale = <T = string>(
  num: string | number,
  decimals?: number,
): T => {
  if (isEmpty(num) || isEmpty(decimals)) {
    return num as T
  }
  const result = Number(num) * 10 ** decimals!
  if (typeof num === 'string') {
    return String(result) as T
  }
  return result as T
}

// BigNumber.from needs the parameter to be integer otherwise it will throw error
// Create this help function to make sure passing integer to BigNumber.from
export const toBigNumber = (num: string | number) => {
  const numStr = scientificToDecimal(num)
  try {
    return BigNumber.from(numStr)
  } catch (e) {
    return BigNumber.from(Number(numStr).toFixed(0))
  }
}
