import { StellarNetwork, NetworkMetadatas } from './network'

export const findPoolMetadata = (network: StellarNetwork, poolName: string) => {
  const selectedNetworkMetadata = NetworkMetadatas.find(
    (metadata) => metadata.network === network,
  )
  if (selectedNetworkMetadata) {
    return selectedNetworkMetadata.pools.find(
      (pool) => pool.poolName === poolName,
    )
  }
  return undefined
}
