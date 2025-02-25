import { STELLAR_CHAINS_INFO, StellarPoolInfo } from '@huma-finance/shared'
import { Client as HumaConfigClient } from '@huma-finance/soroban-huma-config'

export async function fetchStellarPoolSentinel(
  poolInfo: StellarPoolInfo,
  sourceAddress: string,
): Promise<string> {
  const chainInfo = STELLAR_CHAINS_INFO[poolInfo.chainId]
  const humaConfigClient = new HumaConfigClient({
    publicKey: sourceAddress,
    networkPassphrase: chainInfo.networkPassphrase,
    contractId: chainInfo.humaConfig,
    rpcUrl: chainInfo.rpc,
  })
  const sentinel = await humaConfigClient.get_sentinel()
  const sentinelVal = sentinel.result
  console.log(sentinelVal)
  return sentinelVal
}
