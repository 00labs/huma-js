export function convertToShares(
  totalAssets: bigint,
  totalSupply: bigint,
  assets: bigint,
): bigint {
  if (totalSupply !== BigInt(0) && totalAssets === BigInt(0)) {
    return BigInt(0)
  }
  if (totalSupply === BigInt(0)) {
    return assets
  }

  return (assets * totalSupply) / totalAssets
}
