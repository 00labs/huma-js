import { StellarChainEnum } from '../chain'
import { STELLAR_TESTNET_METADATA } from '../metadata/testnet'
import { POOL_NAME, POOL_TYPE } from '../../utils'
import { IndustryType } from '../../v2'

export type StellarPoolInfo = {
  title: string
  chainId: StellarChainEnum
  poolName: POOL_NAME
  poolType: POOL_TYPE
  industry: IndustryType
  desc: string
  poolStorage: string
  pool: string
  poolManager: string
  poolCredit: string
  creditManager: string
  creditStorage: string
  juniorTranche: string
  seniorTranche?: string
  underlyingToken: {
    address: string
    symbol: string
    decimals: number
    icon: string
  }
  extra?: {
    borrower: string
    isClosed?: boolean
  }
}

export type StellarPoolsInfo = {
  [poolName in POOL_NAME]?: StellarPoolInfo
}

export type StellarChainPoolsInfo = {
  [chainId in StellarChainEnum]: StellarPoolsInfo
}

export const STELLAR_CHAIN_POOLS_INFO = {
  [StellarChainEnum.StellarTestnet]: STELLAR_TESTNET_METADATA,
} as StellarChainPoolsInfo

export type StellarChainInfo = {
  rpc: string
  humaConfig: string
}

export type StellarChainsInfo = {
  [chainId in StellarChainEnum]: StellarChainInfo
}

export const STELLAR_CHAINS_INFO: StellarChainsInfo = {
  [StellarChainEnum.StellarTestnet]: {
    rpc: 'https://soroban-testnet.stellar.org',
    humaConfig: 'CDX6NBJ3OV4TWRCZK4DFBHDHE37UUDS66PPGNIPBGUI56D254EKVFETX',
  },
  [StellarChainEnum.StellarMainnet]: {
    rpc: '',
    humaConfig: '',
  },
}
