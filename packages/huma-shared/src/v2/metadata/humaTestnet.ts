import { ChainEnum } from '../../utils/chain'
import { POOL_NAME, POOL_TYPE } from '../../utils/pool'
import { FirstLossCoverIndex } from '../types'
import { PoolsInfoV2 } from '../utils'

export const HUMA_TESTNET_METADATA: PoolsInfoV2 = {
  JiaV2: {
    chainId: ChainEnum.HumaTestnet,
    poolVersion: 'v2',
    poolName: POOL_NAME.JiaV2,
    poolType: POOL_TYPE.CreditLine,
    pool: '0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1',
    poolConfig: '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
    poolCredit: '0x59b670e9fa9d0a427751af201d676719a970857b',
    poolCreditManager: '0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44',
    poolSafe: '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0',
    seniorTrancheVault: '0x68B1D87F95878fE05B998F19b66F4baba5De1aed',
    juniorTrancheVault: '0x3Aa5ebB10DC797CAC828524e59A333d0A371443c',
    epochManager: '0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE',
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82',
      [FirstLossCoverIndex.affiliate]:
        '0x9A676e781A523b5d0C0e43731313A708CB607508',
    },
    seniorAPY: '10-20%',
    juniorAPY: '10-20%',
    title: 'Jia V2 Testing Pool',
    desc: 'Jia brings real-world asset returns to crypto investors while tackling the multi-trillion-dollar credit gap in emerging markets. By providing blockchain-based financing to small businesses and rewarding borrowers who repay with ownership, Jia enables them to create wealth and prosperity for themselves and their communities.',
    supplyLink: 'https://app.huma.finance',
  },
}
