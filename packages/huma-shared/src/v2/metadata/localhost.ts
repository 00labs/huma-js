import { ChainEnum } from '../../utils/chain'
import { POOL_NAME, POOL_TYPE } from '../../utils/pool'
import { FirstLossCoverIndex } from '../types'
import { PoolsInfoV2 } from '../utils'

export const LOCALHOST_METADATA: PoolsInfoV2 = {
  JiaV2: {
    chainId: ChainEnum.Localhost,
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
  ArfCreditPoolV2: {
    chainId: ChainEnum.Localhost,
    poolVersion: 'v2',
    poolName: POOL_NAME.ArfCreditPoolV2,
    poolType: POOL_TYPE.ReceivableBackedCreditLine,
    pool: '0x4C4a2f8c81640e47606d3fd77B353E87Ba015584',
    poolConfig: '0x162A433068F51e18b7d13932F27e66a3f99E6890',
    poolCredit: '0x51A1ceB83B83F1985a81C295d1fF28Afef186E02',
    poolCreditManager: '0x8198f5d8F8CfFE8f9C413d98a0A55aEB8ab9FbB7',
    poolSafe: '0x5081a39b8A5f0E35a8D959395a630b68B74Dd30f',
    seniorTrancheVault: '0x2E2Ed0Cfd3AD2f1d34481277b3204d807Ca2F8c2',
    juniorTrancheVault: '0xD8a5a9b31c3C0232E196d518E89Fd8bF83AcAd43',
    epochManager: '0x21dF544947ba3E8b3c32561399E88B52Dc8b2823',
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0x1fA02b2d6A771842690194Cf62D91bdd92BfE28d',
      [FirstLossCoverIndex.affiliate]:
        '0xdbC43Ba45381e02825b14322cDdd15eC4B3164E6',
    },
    seniorAPY: '10-20%',
    juniorAPY: '10-20%',
    title: 'Arf V2 Testing Pool',
    desc: 'Arf provides an innovative on-chain liquidity solution that simplifies cross-border payments by facilitating immediate USDC-based settlements and tokenizing payment orders, enhancing transparency in the process.',
    supplyLink: 'https://app.huma.finance',
  },
}
