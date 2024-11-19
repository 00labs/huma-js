import { scientificToDecimal } from '../../src/common/utils/scientificToDecimal'

describe('scientificToDecimal', () => {
  it('returns the decimal representation of a scientific notation number', () => {
    expect(scientificToDecimal('1e+32')).toBe(
      '100000000000000000000000000000000',
    )
    expect(scientificToDecimal('1.23e+18')).toBe('1230000000000000000')
    expect(scientificToDecimal('3.14e-5')).toBe('0.0000314')
  })

  it('returns the decimal representation of a non-scientific notation number', () => {
    expect(scientificToDecimal('123')).toBe('123')
    expect(scientificToDecimal('0.00123')).toBe('0.00123')
  })

  it('returns the decimal representation of a non-numeric input', () => {
    expect(scientificToDecimal('abc')).toBe('NaN')
    expect(scientificToDecimal('')).toBe('NaN')
  })
})
