import { POOL_NAME } from '../../utils/pool'
import POOL_ABI from '../abis/Pool.json'
import TRANCHE_VAULT_ABI from '../abis/TrancheVault.json'
import { PoolsInfoV2 } from '../utils'

export const LOCALHOST_METADATA: PoolsInfoV2 = {
  HumaCreditLineV2: {
    poolName: POOL_NAME.HumaCreditLineV2,
    pool: '0x1fA02b2d6A771842690194Cf62D91bdd92BfE28d',
    poolAbi: POOL_ABI,
    seniorTrancheVault: '0xD0141E899a65C95a556fE2B27e5982A6DE7fDD7A',
    juniorTrancheVault: '0x07882Ae1ecB7429a84f1D53048d35c4bB2056877',
    trancheVaultAbi: TRANCHE_VAULT_ABI,
    seniorAPY: '10-20%',
    juniorAPY: '10-20%',
    underlyingToken: {
      address: '0x1429859428C0aBc9C2C47C8Ee9FBaf82cFA0F20f',
      symbol: 'USDC',
      decimals: 18,
      icon: 'USDC',
    },
    title: 'Huma Credit Line V2',
    borrowDesc:
      'Credit lines backed by your future crypto income. Only available to the members of partner DAOs during beta.',
    lendDesc:
      'Earn active yield by participating in credit lines backed by on-chain income. Only available to the members of partner DAOs during beta.',
  },
}
