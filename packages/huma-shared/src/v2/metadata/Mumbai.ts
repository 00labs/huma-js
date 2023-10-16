import { POOL_NAME } from '../../utils/pool'
import POOL_ABI from '../abis/Pool.json'
import POOL_VAULT_ABI from '../abis/PoolVault.json'
import TRANCHE_VAULT_ABI from '../abis/TrancheVault.json'
import { PoolsInfoV2 } from '../utils'

export const MUMBAI_METADATA: PoolsInfoV2 = {
  HumaCreditLineV2: {
    poolName: POOL_NAME.HumaCreditLineV2,
    pool: '0x9cb69C20FBf67d2fFe13dFF770231e8cbb653AEE',
    poolAbi: POOL_ABI,
    poolVaultAbi: POOL_VAULT_ABI,
    seniorTrancheVault: '0x7e4eac8B81f4E6Cd9E32CEFd169c06C5f5199587',
    juniorTrancheVault: '0xCf3d123B662fd4dD813483b0703fa63503aa1fbc',
    trancheVaultAbi: TRANCHE_VAULT_ABI,
    poolVault: '0xc228409Dc45adf03846998Ab05354B6DD5A25196',
    seniorAPY: '10-20%',
    juniorAPY: '10-20%',
    poolUnderlyingToken: {
      address: '0x58CEc4659aA7A236A117B739AfCAa2425A7d99A6',
      symbol: 'USDC',
      decimals: 6,
      icon: 'USDC',
    },
    title: 'Huma Credit Line V2',
    borrowDesc:
      'Credit lines backed by your future crypto income. Only available to the members of partner DAOs during beta.',
    lendDesc:
      'Earn active yield by participating in credit lines backed by on-chain income. Only available to the members of partner DAOs during beta.',
  },
}
