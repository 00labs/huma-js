import { POOL_NAME, POOL_TYPE } from '../../../common'
import { ChainEnum } from '../../utils/chain'
import { FirstLossCoverIndex } from '../types'
import { PoolsInfoV2 } from '../utils'

export const AMOY_METADATA: PoolsInfoV2 = {
  ArfCreditPoolV2: {
    chainId: ChainEnum.Amoy,
    poolVersion: 'v2',
    industry: 'Remittance Financing',
    poolName: POOL_NAME.ArfCreditPoolV2,
    poolType: POOL_TYPE.ReceivableBackedCreditLine,
    pool: '0x055AA17ed23AdE6e4437f6259DF2FF1440d2D7ed',
    poolConfig: '0xa8eD8a51245c16E218fb6A26B3cf51CF526Babd0',
    poolCredit: '0xb455B4BFcA6cFA9873D90FfAdA43369009e14fd2',
    poolCreditManager: '0xCc063C2b40A212C47523670bCD73274A8C596573',
    poolSafe: '0xE9F7d3deb6d3b6D0a4CD19B50690cCB7a654F2F9',
    seniorTrancheVault: '0x9D89D7b88FcC18f0B188978eC46Bbac6b275F69b',
    juniorTrancheVault: '0x460b59d033421931Ad61bd7B29EA135D40edc158',
    epochManager: '0xdead56d2e3f64BB340aCc6245007F624639d1306',
    receivable: '0xA457970f2d9f0EDaaf027cD581336235c9E5A669',
    poolUnderlyingToken: {
      address: '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582',
      symbol: 'USDC',
      decimals: 6,
      icon: 'USDC',
    },
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0xC272E1bf77B7e9E78F90e02D45Ec3673eAEe78FF',
      [FirstLossCoverIndex.admin]: '0xB82bEE913f0108ef871d3aa41521DcA061ddEf5F',
    },
    seniorAPY: '10-20%',
    juniorAPY: '10-20%',
    title: 'Arf V2 Testing Pool',
    desc: 'Arf provides an innovative on-chain liquidity solution that simplifies cross-border payments by facilitating immediate USDC-based settlements and tokenizing payment orders, enhancing transparency in the process.',
    supplyLink: 'https://uer4clyybno.typeform.com/arfcreditline',
  },
}
