import { PoolsMetadataV2 } from '../utils'

export const LOCALHOST_METADATA: PoolsMetadataV2 = {
  HumaCreditLineV2: {
    pool: '0x1fA02b2d6A771842690194Cf62D91bdd92BfE28d',
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
