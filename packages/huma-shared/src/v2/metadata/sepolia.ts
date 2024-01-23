import { ChainEnum } from '../../utils/chain'
import { POOL_NAME, POOL_TYPE } from '../../utils/pool'
import { FirstLossCoverIndex } from '../types'
import { PoolsInfoV2 } from '../utils'

export const SEPOLIA_METADATA: PoolsInfoV2 = {
  JiaV2: {
    chainId: ChainEnum.Sepolia,
    poolVersion: 'v2',
    poolName: POOL_NAME.JiaV2,
    poolType: POOL_TYPE.CreditLine,
    pool: '0x8fFf5E9bE8f3F78520C1a265e3C2Ca09dcde32c6',
    poolCredit: '0x2d6a0d0b8F76cAF34bf14B1499EE150628E14d9e',
    poolCreditManager: '0xe5FDdB9795130D4bedCb284C7536d2A87d0022Ec',
    poolConfig: '0x8Dd4bd291Dac16f21f91580Bd5372BAA069C078E',
    poolSafe: '0x995F7Afa423A87020C3c3e90fb3e5Dc65ecb02e7',
    seniorTrancheVault: '0x9ba971Cc285533D34dA16FeB49b0a95618Ad67d5',
    juniorTrancheVault: '0x4D71349d55A0cC64b7f5D855A7655544E9ec2575',
    epochManager: '0x54D2F8Dd78fDC89e485d5d80d85EDe627A9a703b',
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0xEEdC2E188043F9dEF3c8EE6927220bfB079B67Fd',
      [FirstLossCoverIndex.admin]: '0x389dB3B261115824475b7d5Dea50c9A784e787DC',
    },
    seniorAPY: '10-20%',
    juniorAPY: '10-20%',
    title: 'Jia V2 Testing Pool',
    desc: 'Jia brings real-world asset returns to crypto investors while tackling the multi-trillion-dollar credit gap in emerging markets. By providing blockchain-based financing to small businesses and rewarding borrowers who repay with ownership, Jia enables them to create wealth and prosperity for themselves and their communities.',
    supplyLink: 'https://app.huma.finance',
  },
  ArfCreditPoolV2: {
    chainId: ChainEnum.Sepolia,
    poolVersion: 'v2',
    poolName: POOL_NAME.ArfCreditPoolV2,
    poolType: POOL_TYPE.ReceivableBackedCreditLine,
    pool: '0x7C84685f62Fa6fdec6e779b008d8945B40703A51',
    poolConfig: '0xb7a824B3486389A0FbC9Ef813eE6CB16B889E6Cf',
    poolCredit: '0x73b28e5abfE959AE45a0B4468a100B60567eF76b',
    poolCreditManager: '0x821A816b12d1963EBe3b017ef0DDB93d8791FEB3',
    poolSafe: '0xAb76032cE60dec6CE48CcB801481D252Fe501aa1',
    seniorTrancheVault: '0xD7877fC77114f9812808291D7E51990C3Ef6f1dA',
    juniorTrancheVault: '0xbeAA9fcA5C493dd2ab95be02d2aB80fe49fC7f94',
    epochManager: '0x6F414C874a9927663ceD95310cf5f3bae0d2d126',
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0xa329Fd3204001389B6a3311FBb5d5AD076a6AB8A',
      [FirstLossCoverIndex.admin]: '0x172649B374170B33f93E088bC7ad56CC2906a30F',
    },
    seniorAPY: '10-20%',
    juniorAPY: '10-20%',
    title: 'Arf V2 Testing Pool',
    desc: 'Arf provides an innovative on-chain liquidity solution that simplifies cross-border payments by facilitating immediate USDC-based settlements and tokenizing payment orders, enhancing transparency in the process.',
    supplyLink: 'https://app.huma.finance',
  },
}
