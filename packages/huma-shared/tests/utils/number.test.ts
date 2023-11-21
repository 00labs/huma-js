/* eslint-disable @typescript-eslint/no-explicit-any */
import { BigNumber } from 'ethers'
import {
  downScale,
  formatMoney,
  formatNumber,
  toBigNumber,
  upScale,
} from '../../src/utils/number'

describe('formatMoney', () => {
  it('returns the input if it is empty', () => {
    expect(formatMoney(undefined)).toBeUndefined()
  })

  it('returns the formatted number if the input is a valid number', () => {
    expect(formatMoney(1234.56)).toBe('$1,235')
    expect(formatMoney('1234.56')).toBe('$1,235')
  })

  it('rounds the number if it is greater than 1000', () => {
    expect(formatMoney(1234.99)).toBe('$1,235')
    expect(formatMoney('1234.99')).toBe('$1,235')
  })
})

describe('formatNumber', () => {
  it('returns the input if it is empty or NaN', () => {
    expect(formatNumber(undefined)).toBeUndefined()
    expect(formatNumber('NaN')).toBe('NaN')
  })

  it('returns the formatted number if the input is a valid number', () => {
    expect(formatNumber(1234.56)).toBe('1,235')
    expect(formatNumber('1234.56')).toBe('1,235')
  })

  it('rounds the number if it is greater than 1000', () => {
    expect(formatNumber(1234.99)).toBe('1,235')
    expect(formatNumber('1234.99')).toBe('1,235')
  })
})

describe('downScale', () => {
  it('returns the input if it is empty or decimals is empty', () => {
    expect(downScale(undefined as any, 2)).toBeUndefined()
    expect(downScale('123.45', undefined)).toBe('123.45')
  })

  it('returns the down-scaled number if the input is a valid number', () => {
    expect(downScale('123000000.456', 6)).toBe('123.0')
    expect(downScale(123000000, 6)).toBe(123)
  })
})

describe('upScale', () => {
  it('returns the input if it is empty or decimals is empty', () => {
    expect(upScale(undefined as any, 2)).toBeUndefined()
    expect(upScale('123.45', undefined)).toBe('123.45')
  })

  it('returns the upscaled number if the input is a valid number', () => {
    expect(upScale('123.45', 2)).toBe('12345')
    expect(upScale(123.45, 2)).toBe(12345)
  })

  it('returns the upscaled number if the input is a valid number and decimals would cause overflow', () => {
    expect(
      upScale<BigNumber>(BigNumber.from(10), 18).eq(
        BigNumber.from('10000000000000000000'),
      ),
    ).toBe(true)
  })
})

describe('toBigNumber', () => {
  it('returns a BigNumber from a string', () => {
    expect(toBigNumber('123')).toEqual(BigNumber.from('123'))
    expect(toBigNumber('123.45')).toEqual(BigNumber.from('123'))
  })

  it('returns a BigNumber from a number', () => {
    expect(toBigNumber(123)).toEqual(BigNumber.from('123'))
    expect(toBigNumber(123.45)).toEqual(BigNumber.from('123'))
  })

  it('returns a BigNumber from a scientific notation string', () => {
    expect(toBigNumber('1e18')).toEqual(BigNumber.from('1000000000000000000'))
    expect(toBigNumber('1.23e18')).toEqual(
      BigNumber.from('1230000000000000000'),
    )
  })

  it('returns a BigNumber from a scientific notation number', () => {
    expect(toBigNumber(1e18)).toEqual(BigNumber.from('1000000000000000000'))
    expect(toBigNumber(1.23e18)).toEqual(BigNumber.from('1230000000000000000'))
  })
})
