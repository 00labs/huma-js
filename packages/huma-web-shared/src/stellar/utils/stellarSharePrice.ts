/**
 * Per-share price for a Stellar tranche (total assets / total supply).
 * Precision to 3 decimal places. Returns 1 if supply is zero.
 */
export function getStellarPerSharePrice(
  totalAssets: bigint,
  totalSupply: bigint,
): number {
  if (totalAssets > BigInt(0) && totalSupply > BigInt(0)) {
    return Number((totalAssets * BigInt(1000)) / totalSupply) / 1000
  }
  return 1
}

/**
 * Convert a underlying token amount to tranche shares for redemption.
 * sharesRaw = (usdcRaw * totalSupply) / totalAssets
 */
export function getStellarSharesFromUnderlyingTokenAmount(
  underlyingTokenAmount: bigint,
  totalAssets: bigint,
  totalSupply: bigint,
): bigint {
  if (totalAssets <= BigInt(0)) {
    return BigInt(0)
  }
  return (underlyingTokenAmount * totalSupply) / totalAssets
}
