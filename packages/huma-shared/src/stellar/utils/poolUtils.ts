import { StellarChainEnum } from '../chain'
import { STELLAR_CHAIN_POOLS_INFO } from '../types'

export function getStellarPoolInfoForPoolAddress(
  chainId: StellarChainEnum,
  poolAddress: string,
) {
  const poolsInfo = STELLAR_CHAIN_POOLS_INFO[chainId]
  if (!poolsInfo) {
    return null
  }

  let foundPoolInfo = null

  for (const poolInfo of Object.values(poolsInfo)) {
    if (poolInfo.pool.toLowerCase() === poolAddress.toLowerCase()) {
      foundPoolInfo = poolInfo
      break
    }
  }

  return foundPoolInfo
}
