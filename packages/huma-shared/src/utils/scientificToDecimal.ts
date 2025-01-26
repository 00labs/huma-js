/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable radix */
/* eslint-disable prefer-destructuring */
// @ts-nocheck
// github.com/jam3/scientific-to-decimal
export const scientificToDecimal = (value: number | string) => {
  value = parseFloat(value)

  const REGEX_SCIENTIFIC = /(\d+\.?\d*)e\d*(\+|-)(\d+)/
  const valueString = value.toString()
  let result = REGEX_SCIENTIFIC.exec(valueString)
  let base
  let positiveNegative
  let exponents
  let precision
  let rVal

  // is scientific
  if (result) {
    // [ '1e+32', '1', '+', '2', index: 0, input: '1e+32' ]
    base = result[1]
    positiveNegative = result[2]
    exponents = result[3]

    if (positiveNegative === '+') {
      precision = parseInt(exponents)

      // base is a decimal
      if (base.indexOf('.') !== -1) {
        result = /(\d+\.)(\d)/.exec(base)

        // [ 2 ] == right side after decimal
        // [ 1 ] == left side before decimal
        precision -= result[2].length + result[1].length

        rVal = base.split('.').join('') + getZeros(precision)
      } else {
        rVal = base + getZeros(precision)
      }
    } else {
      precision = base.length + parseInt(exponents) - 1

      // if it contains a period we want to drop precision by one
      if (base.indexOf('.') !== -1) {
        precision--
      }

      rVal = value.toFixed(precision)
    }
  } else {
    rVal = value.toString()
  }

  return rVal
}

function getZeros(count) {
  let rVal = ''

  for (let i = 0; i < count; i++) {
    rVal += '0'
  }

  return rVal
}
