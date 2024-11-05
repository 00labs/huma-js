import { Client as CreditStorageClient } from '@huma-finance/soroban-credit-storage'
import { Client as PoolClient } from '@huma-finance/soroban-pool'
import { Client as PoolCreditClient } from '@huma-finance/soroban-pool-credit'
import { Client as PoolStorageClient } from '@huma-finance/soroban-pool-storage'
import { Client as TrancheVaultClient } from '@huma-finance/soroban-tranche-vault'

export const stellarTryFn = async (
  client:
    | CreditStorageClient
    | PoolClient
    | PoolCreditClient
    | PoolStorageClient
    | TrancheVaultClient,
  method: string,
  params: any,
) => {
  try {
    // @ts-ignore
    const res = await client[method](params)
    return res.result
  } catch (e) {
    console.warn(e)
    return null
  }
}
