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
    poolStorage: 'CCIMD2GVMKRK5UNOD7JJSM74HFLOFJ6ODAXY2OQBA46JQ4QYAZ4P34EF',
    pool: 'CCXBTYYRX3TALCODB7SWOJRPREXJYPCRZMVKSTXSTVQYB2AV5BF6HL44',
    poolManager: 'CB334NWVJ4SDD3ON6H2WRE2K57NCETY3NJVUSBVWSVTT6ATB4ADMWJED',
    poolCredit: 'CDCNJDPWCGLSOD3W2W3G34XILCIF7WPBG2SCXHTVSTJL4QGD4HFWBZFM',
    creditManager: 'CDY6NTTINATBCG7TOVXB23XFRDES4QBR4CF2375YZEYKVNJZJR423ITR',
    creditStorage: 'CBXWR7FOC4IQHGGTSF7OHNQAGBACVTY7U6SR6LPDXWE3F4S74MOF3JDR',
    juniorTranche: 'CBN6KKNSWJLYVQS3YPX4FK7DJZGTSRTCQN52FX2CZ342EC7LWHWJFBHH',
    seniorTranche: 'CADMAL7SRLFVF2JI7RJZY6UTIZBPZUT7NBTMWXSCH255JK3LLWQHU5Y3',
    trancheDecimals: 6,
    underlyingToken: {
      address: 'CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA',
      symbol: 'USDC',
      decimals: 7,
      icon: 'USDC',
    },
    extra: {
      borrower: 'GCI3WLD2P3OHSMMDZU6X2FMSRHFXOI6JCH5HQK5GBRN5Z2NVMOJMBIDV',
    },
  },
}
