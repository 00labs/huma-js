import { ChainEnum } from '../../utils/chain'
import { POOL_NAME, POOL_TYPE, REDIRECTS } from '../../utils/pool'
import { FirstLossCoverIndex } from '../types'
import { PoolsInfoV2 } from '../utils'

export const CELO_METADATA: PoolsInfoV2 = {
  ArfCreditPoolV2: {
    chainId: ChainEnum.Celo,
    poolVersion: 'v2',
    industry: 'Remittance Financing',
    poolName: POOL_NAME.ArfCreditPoolV2,
    poolType: POOL_TYPE.ReceivableBackedCreditLine,
    pool: '0x23be37d5AAb59101B9BB31A96D1bF5D7112250f7',
    poolConfig: '0xfd00E8709cC02B020A63a980729567E808671c21',
    poolCredit: '0x39EaCecFAE2A174Dacd10D10BBD09a6DD2541C18',
    poolCreditManager: '0x4cc72E971547A625b0119f3e72877A5572daEeBb',
    poolSafe: '0x1C35194ca4AB4BA266362BAD25e4C7d2748371AD',
    seniorTrancheVault: '0xc21a5485021C904Ed00b22BF774435a5B33c69bc',
    juniorTrancheVault: '0xaB5Ee8465c8C8d51e2cCc7d52AC53c19AF201Fa4',
    epochManager: '0x7E02636471A1eAa43664335F4002c878aaf8Ec81',
    receivable: '0xE28E77Dc46DfBb8e75CBBC80B2ad79380276722E',
    poolUnderlyingToken: {
      address: '0xcebA9300f2b948710d2653dD7B07f33A8B32118C',
      symbol: 'USDC',
      decimals: 6,
      icon: 'USDC',
    },
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0xC7Fe090371590e8438dCEfA1F2A142e9fEBDeb5b',
      [FirstLossCoverIndex.admin]: '0xd1c72BE0238f9079b9dC0ec96158ea87dE3d76c2',
    },
    seniorAPY: '10-20%',
    juniorAPY: '10-20%',
    title: 'Arf Credit Pool v2',
    desc: 'Arf provides an innovative on-chain liquidity solution that simplifies cross-border payments by facilitating immediate USDC-based settlements and tokenizing payment orders, enhancing transparency in the process.',
    supplyLink: 'https://uer4clyybno.typeform.com/arfcreditline',
    redirect: REDIRECTS.Arf,
    extra: {
      rwrUploader: '0xEA57a8A51377752fFddaa3db4d13CE8F97677F2D',
      noTrancheAutoredeemUpdate: true,
    },
  },
  Raincards: {
    chainId: ChainEnum.Celo,
    poolVersion: 'v2',
    industry: 'None',
    poolName: POOL_NAME.Raincards,
    poolType: POOL_TYPE.CreditLine,
    pool: '0xC3dE7198c93dcb0b2Bb17311cCb0fD3C05C49218',
    poolConfig: '0x5681B6c4eefDf2e0c78E216567707d5143535D4e',
    poolCredit: '0x1e7895480C2A1B07F8d34B510b4E02F308CE926F',
    poolCreditManager: '0x11487e6490AdEBfDE1E74fbE28e9caeEa887436c',
    poolSafe: '0x9104cB4E17d116Ddaaa50CE048a07b71401aBBE8',
    seniorTrancheVault: '0x3273f79F8157E1407d02c748d01Bf0581eC52C53',
    juniorTrancheVault: '0x5992242E2Ec945bf58295c2DA037806995D18497',
    epochManager: '0xf2cE1688b7Ba4C2a7252E95258175e69E384B208',
    poolUnderlyingToken: {
      address: '0xcebA9300f2b948710d2653dD7B07f33A8B32118C',
      symbol: 'USDC',
      decimals: 6,
      icon: 'USDC',
    },
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0x736A2d682A858280FEA8a029Be76744415ef4bcE',
      [FirstLossCoverIndex.admin]: '0xc82138F06475144f6DBDaF590ad4C298AC6318D0',
    },
    seniorAPY: '15%',
    juniorAPY: '15%',
    title: 'Rain Receivables Pool',
    desc: 'The Rain Receivables Pool is reshaping spend management for Web3 teams, enabling Web3 entities like DAOs and protocols to effortlessly manage fiat expenses through corporate cards.',
    redirect: REDIRECTS.Rain,
    extra: {
      noTrancheAutoredeemUpdate: true,
    },
  },
}
