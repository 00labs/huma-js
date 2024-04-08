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
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0xC7Fe090371590e8438dCEfA1F2A142e9fEBDeb5b',
      [FirstLossCoverIndex.admin]: '0xd1c72BE0238f9079b9dC0ec96158ea87dE3d76c2',
    },
    seniorAPY: '10-20%',
    juniorAPY: '10-20%',
    title: 'Arf Credit Pool V2',
    desc: 'Arf provides an innovative on-chain liquidity solution that simplifies cross-border payments by facilitating immediate USDC-based settlements and tokenizing payment orders, enhancing transparency in the process.',
    supplyLink: 'https://uer4clyybno.typeform.com/arfcreditline',
    redirect: REDIRECTS.Arf,
  },
}
