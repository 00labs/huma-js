import { StellarChainEnum } from '../chain'
import { StellarPoolsInfo } from '../types/metadata'
import { POOL_NAME, POOL_TYPE } from '../../utils/pool'

export const STELLAR_TESTNET_METADATA: StellarPoolsInfo = {
  ArfCreditPoolV2: {
    title: 'Arf',
    poolName: POOL_NAME.ArfCreditPoolV2,
    poolType: POOL_TYPE.CreditLine,
    chainId: StellarChainEnum.StellarTestnet,
    industry: 'Remittance Financing',
    desc: '',
    poolStorage: 'CDH36NMUGJOJRKAEXCBS4CCJ4CQPIRBJY6ZLT426RWC6DWTRNXBECUTN',
    pool: 'CDREMNHXG3UJEKTARVE3G3BPOM3Y5U65T6NYYYWAYM6BSHGXNUQW6TTY',
    poolManager: 'CCNKUA62K3T4FQTFOGOVHZNS7UJ36UWYHS727TYSKSWTJ3LVZJOBFMVL',
    poolCredit: 'CBTYMYCPN5P4ISEU47BWGZ5XATA4NKK3MEBB2S65SAKDIVSXUNGTHSBG',
    creditManager: 'CB7RBNZ5EU6AYDTCURUAUQJIYUYTNOL4GLRBSDDZEAPI4NFGI6QQ3NL5',
    creditStorage: 'CAEWZBNLBAJA7NLLKK237RWKI5RY6EO3GH2E2NPSAJRO3F2VBV6S3SFJ',
    juniorTranche: 'CAZ6A7CIXW54JDT4VBASKJIEKMT4KTRGIB5AREWIVNSW2REAJOGP6PN5',
    seniorTranche: 'CCBGPAVIG3ERMNKHF2SD3QPCRNUIRJVLJ577DHSYYGQL764TFG5UMCS6',
    trancheDecimals: 6,
    underlyingToken: {
      address: 'CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA',
      symbol: 'USDC',
      decimals: 7,
      icon: 'USDC',
    },
    extra: {
      borrower: 'GBK62KZMUVEKLGGB3UYCRUP2BVDUE6UEZWUHPUNJ54BKFDTW4CNSF6O7',
    },
  },
}
