import { StellarWallet } from '../services/StellarWallet'

import { Client as PoolClient } from '../packages/pool'
import { Client as PoolCreditClient } from '../packages/poolCredit'
import {
  POOL_NAME,
  StellarNetwork,
  StellarNetworkPassphrase,
  StellarPublicRpcUrl,
} from './network'
import { findPoolMetadata } from './common'

export const getPoolClient = (
  poolName: POOL_NAME,
  network: StellarNetwork,
  wallet: StellarWallet,
) => {
  const poolMetadata = findPoolMetadata(network, poolName)
  if (!poolMetadata) {
    return undefined
  }

  return new PoolClient({
    contractId: poolMetadata.contracts.pool,
    publicKey: wallet.getUserInfo().publicKey,
    networkPassphrase: StellarNetworkPassphrase[network],
    rpcUrl: StellarPublicRpcUrl[network],
    ...wallet,
  })
}

export const getPoolCreditClient = (
  poolName: POOL_NAME,
  network: StellarNetwork,
  wallet: StellarWallet,
) => {
  const poolMetadata = findPoolMetadata(network, poolName)
  if (!poolMetadata) {
    return undefined
  }

  return new PoolCreditClient({
    contractId: poolMetadata.contracts.poolCredit,
    publicKey: wallet.getUserInfo().publicKey,
    networkPassphrase: StellarNetworkPassphrase[network],
    rpcUrl: StellarPublicRpcUrl[network],
    ...wallet,
  })
}
