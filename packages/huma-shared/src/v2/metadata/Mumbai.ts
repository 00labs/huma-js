import { PoolsMetadataV2 } from '../utils'

export const MUMBAI_METADATA: PoolsMetadataV2 = {
  HumaCreditLineV2: {
    pool: '0x848f821669b8F60e002A972FAc4A309042392782',
    seniorAPY: '10-20%',
    juniorAPY: '10-20%',
    underlyingToken: {
      address: '0xa3d366fB6617a6763704291FD0C15410E8e40603',
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
