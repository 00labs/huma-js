import { BN } from '@coral-xyz/anchor'

export function convertToShares(
  totalAssets: BN,
  totalSupply: BN,
  assets: BN,
): BN {
  if (!totalSupply.isZero() && totalAssets.isZero()) {
    return new BN(0)
  }
  if (totalSupply.isZero()) {
    return assets
  }

  return assets.mul(totalSupply).div(totalAssets)
}
