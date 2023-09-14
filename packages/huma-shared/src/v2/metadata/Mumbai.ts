import { PoolsMetadataV2 } from '../utils'

export const MUMBAI_METADATA: PoolsMetadataV2 = {
  HumaCreditLineV2: {
    pool: '0x3Dd5829A0A20229a18553AAf09415E6139EbC5b9',
    estAPY: '10-20%',
    underlyingToken: {
      address: '0x6Dfb932F9fDd38E4B3D2f6AAB0581a05a267C13C',
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
