import { POOL_NAME } from '../../utils/pool'
import POOL_ABI from '../abis/Pool.json'
import TRANCHE_VAULT_ABI from '../abis/TrancheVault.json'
import { PoolsInfoV2 } from '../utils'

export const MUMBAI_METADATA: PoolsInfoV2 = {
  HumaCreditLineV2: {
    poolName: POOL_NAME.HumaCreditLineV2,
    pool: '0x848f821669b8F60e002A972FAc4A309042392782',
    poolAbi: POOL_ABI,
    seniorTrancheVault: '0xAfD360a03aBf192D0F335f24627b5001e2C78fdf',
    juniorTrancheVault: '0x1f10865eF0181D8a7e3d31EcDECA7c615954EfEE',
    trancheVaultAbi: TRANCHE_VAULT_ABI,
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
