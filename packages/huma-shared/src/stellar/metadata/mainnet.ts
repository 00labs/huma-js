import { POOL_NAME, POOL_TYPE } from '../../utils/pool'
import { StellarChainEnum } from '../chain'
import { StellarPoolsInfo } from '../types/metadata'

export const STELLAR_MAINNET_METADATA: StellarPoolsInfo = {
  ArfCreditPoolV2: {
    title: 'Arf - Cross Border Payment Financing',
    poolName: POOL_NAME.ArfCreditPoolV2,
    poolType: POOL_TYPE.CreditLine,
    chainId: StellarChainEnum.StellarMainnet,
    industry: 'Remittance Financing',
    desc: 'Arf provides an innovative on-chain liquidity solution that simplifies cross-border payments by facilitating immediate USDC-based settlements and tokenizing payment orders, enhancing transparency in the process.',
    poolStorage: 'CAADAYJOZF5HXPVZXBXA3PLCU7OSRW34OKVXG2676KAGZVZBI6EYQ73L',
    pool: 'CDVJY4NLTSKNLHO2JIRKDERE366WYG3OSJY42VOLI7DBAX4X5Q2BY75O',
    poolManager: 'CBFX4CMIWVOVFTJCRC5BYTBOXBZVJXNUI2D5UWM6WP4J2VBXRFYV4YQC',
    poolCredit: 'CC34OGI32WJDSGFES3HWSETSKPN5BQLDEYFHFTDVTUEL2HZLJG5M2UAJ',
    creditManager: 'CBX7MQGXQN6DHGDDRARUH266PIIDTFB5H5HVFPFL365V2JJPX2OWZOZT',
    creditStorage: 'CCXOG76F7A67FHR5OVJPGUVLHF55VOYJZADWEQDDMVLR66R3ODNRAIEP',
    juniorTranche: 'CDJ6AO57ZWBIDITDN32URXYQY6MTSFBNF6OFOCENRDE2MUB67UZKLKDP',
    seniorTranche: 'CB7ZHYQW72JW4GA7ZGGZZQQSXC4H7QRJK6CA5JLQCOZKLL2YMSABKQNX',
    trancheDecimals: 6,
    underlyingToken: {
      address: 'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75',
      symbol: 'USDC',
      decimals: 7,
      icon: 'USDC',
    },
    extra: {
      borrower: 'GBQ4MIGKASCJG4GNEOQ3G6Z6YDUXCAKYARB3MNJ7QOF54MNMYW7HP62V',
    },
  },
  Roam: {
    title: 'Roam - DePIN Financing',
    poolName: POOL_NAME.Roam,
    poolType: POOL_TYPE.CreditLine,
    chainId: StellarChainEnum.StellarMainnet,
    industry: 'DePIN',
    desc: 'Roam Network is a pioneering platform that leverages Decentralized Physical Infrastructure Networks (DePIN) to transform mobile network interactions into valuable rewards.',
    poolStorage: 'CAB53KIRFB6S5AB73NCCLKM5XMYTKD75RL3FGVG5ZKDUQBGVUIK4ZRDC',
    pool: 'CCCWIFYK57JQJ7PUE5OCH7KIG4LJECSAUL6VCOB3RYTH3G7LK5XWUPLV',
    poolManager: 'CAA5V7EUL54JWLZMM5ZW4UMNFFWIEQAB74QZ7BFPDS4TU3YGURNB7X3O',
    poolCredit: 'CDLV3BYERCMZ6GA2K7N737SSS7OCOMDG4YQOK3L7ECBQF3QSYWJ64KPU',
    creditManager: 'CBOBDST2PFMLN6CP6KP3TA67NV7AM3AURTUQ2UFCO6QTUGNAQKSIWYKE',
    creditStorage: 'CDVTUZZPATZD236WX3RQF57WWBGU74OMEUXJZQ3LTT6H5SCZVFTFV3ZD',
    juniorTranche: 'CBT55AVA4MM5DLYJA7KW23GQY64KGOTQF5ELEY7CMYJ6TDQ43QMPEF7B',
    trancheDecimals: 6,
    underlyingToken: {
      address: 'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75',
      symbol: 'USDC',
      decimals: 7,
      icon: 'USDC',
    },
  },
}
