/* eslint-disable @typescript-eslint/no-explicit-any */
import { combineStyles } from '../../src/common/utils/style'

describe('combineStyles', () => {
  it('combines multiple styles into a single style object', () => {
    const style1 = { color: 'red' }
    const style2 = { fontSize: '16px' }
    const style3 = (theme: any) => ({ backgroundColor: theme.primaryColor })

    const combinedStyle = combineStyles(style1, style2, style3)

    const theme = { primaryColor: 'blue' }
    const result = combinedStyle(theme)

    expect(result).toEqual({
      color: 'red',
      fontSize: '16px',
      backgroundColor: 'blue',
    })
  })

  it('returns an empty object if no styles are provided', () => {
    const combinedStyle = combineStyles({})

    const theme = { primaryColor: 'blue' }
    const result = combinedStyle(theme)

    expect(result).toEqual({})
  })
})
