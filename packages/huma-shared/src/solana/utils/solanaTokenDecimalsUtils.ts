import { BN } from '@coral-xyz/anchor'

/**
 * Converts a human-readable amount to the smallest unit (like lamports) based on the token's decimals.
 * @param amount - The human-readable amount (e.g., "1.5")
 * @param decimals - The number of decimals for the token (e.g., 6 for USDC)
 * @returns The amount in the smallest unit (e.g., 1500000)
 */
function parseUnits(amount: string, decimals: number): BN {
  // Ensure the amount is a string
  const amountBn = new BN(amount.replace('.', '')) // Remove the decimal point and convert to a big number
  const decimalFactor = new BN(10).pow(new BN(decimals)) // Calculate 10^decimals

  return amountBn
    .mul(decimalFactor)
    .div(new BN(10).pow(new BN(amount.split('.')[1]?.length || 0)))
}

/**
 * Converts a value from the smallest unit (like lamports) to a human-readable format.
 * @param amount - The value in the smallest unit (e.g., lamports)
 * @param decimals - The number of decimals for the token (e.g., 6 for USDC)
 * @returns The human-readable amount as a string
 */
function formatUnits(amount: BN, decimals: number): string {
  const decimalFactor = new BN(10).pow(new BN(decimals))

  const wholePart = amount.div(decimalFactor) // Integer part
  const fractionalPart = amount.mod(decimalFactor) // Remainder

  // If there's no fractional part, return just the whole part
  if (fractionalPart.isZero()) {
    return wholePart.toString()
  }

  // Convert fractional part to the correct decimal place
  const fractionalString = fractionalPart
    .toString()
    .padStart(decimals, '0')
    .replace(/0+$/, '')

  return `${wholePart.toString()}.${fractionalString}`
}

export const SolanaTokenUtils = {
  parseUnits,
  formatUnits,
}
