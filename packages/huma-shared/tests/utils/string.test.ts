import { capitalizeFirstLetter } from '../../src/common/utils/string'

describe('capitalizeFirstLetter', () => {
  it('capitalizes the first letter of a string', () => {
    expect(capitalizeFirstLetter('hello')).toBe('Hello')
    expect(capitalizeFirstLetter('world')).toBe('World')
    expect(capitalizeFirstLetter('')).toBe('')
  })

  it('does not modify the string if the first character is already capitalized', () => {
    expect(capitalizeFirstLetter('Hello')).toBe('Hello')
    expect(capitalizeFirstLetter('World')).toBe('World')
  })
})
