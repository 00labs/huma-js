export const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1)

export const toPercentage = (num?: number, decimals = 2) => {
  if (num === undefined) {
    return '--'
  }
  return `${Math.round(num * 10 ** decimals * 100) / 10 ** decimals}%`
}
