import { StellarChainEnum } from '../chain'
import { StellarPoolsInfo } from '../types/metadata'
import { POOL_NAME, POOL_TYPE } from '../../utils/pool'

export const STELLAR_TESTNET_METADATA: StellarPoolsInfo = {
  Roam: {
    title: 'Roam - Supply Chain Financing',
    poolName: POOL_NAME.Roam,
    poolType: POOL_TYPE.CreditLine,
    chainId: StellarChainEnum.StellarTestnet,
    industry: 'Supply Chain Financing',
    desc: '',
    poolStorage: 'CBA35JCIXFRAEPRVD3JAQ5WLC7SYZP3RABUKJ52LU5EI2YQ6CDNIAQZF',
    pool: 'CBAJF4BORH2YLIZH4QQSBGDD62VVUKVTNESXRV7KVXTSQ2X4WWP2M3NC',
    poolManager: 'CDLLMPQMNIT7HE2Q6PGVSWYKAE7FLUHVM4QYV7D4ISLT3GD4XZDVSBXV',
    poolCredit: 'CDPYWOCBSXC3W6BYRKO645OQLJNDDZ2EDSZ2Y547BL4LHMSRU7FUVTVG',
    creditManager: 'CBEH5SKVKC6GXP5FQLAUFX43GAFRXZDOHDUQW3CRFD5BQVH7L6YSBP4V',
    creditStorage: 'CADDOLDFYN6Y2DXNYMX2ILVLPLU5W7MAQ7GBOOYWJ6JCH4DGHLUH2FB3',
    juniorTranche: 'CB6K4IUC3CJHIWVHHLBDTGXVS6CT64EKGD5CGBIDNMSAKVZHCWQ3LM2D',
    trancheDecimals: 6,
    underlyingToken: {
      address: 'CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA',
      symbol: 'USDC',
      decimals: 7,
      icon: 'USDC',
    },
    extra: {
      borrower: 'GCHMCS6HZBPFENKVRJHV3CTSSOJECHOLLODDNVLGEBXPHIBRT54JGMW6',
    },
  },
}
