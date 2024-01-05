import { ChainEnum } from '../../utils/chain'
import { POOL_NAME, POOL_TYPE } from '../../utils/pool'
import { FirstLossCoverIndex } from '../types'
import { PoolsInfoV2 } from '../utils'

export const MUMBAI_METADATA: PoolsInfoV2 = {
  JiaV2: {
    chainId: ChainEnum.Mumbai,
    poolVersion: 'v2',
    poolName: POOL_NAME.JiaV2,
    poolType: POOL_TYPE.CreditLine,
    pool: '0x83408668B81D6931750933b6433e94A314974982',
    poolCredit: '0x7AaE3455A0685B4f63bF572a7d981a6B35a1A8b3',
    poolCreditManager: '0xAaAe7D8f89c7F65dB092a3d4b958e24Fe6d059e3',
    poolConfig: '0x6fb859559fb40BED95D8AE63c28F02AdF0b1BDdA',
    poolSafe: '0xeF2fdEC53ED2532EC0F7e5b5CCC4930E719dDF75',
    seniorTrancheVault: '0xc0FbD5064f6881F515Eb874b352c4B410374a21D',
    juniorTrancheVault: '0x973767ee0815D0769fD53d2F37f6423aDfC1b50f',
    epochManager: '0xCb4a2f35A72dB24b879048CE4e74CE61168E69e4',
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0x31aA8A92F2E97a2cD16419045824993c19Ba04Be',
      [FirstLossCoverIndex.affiliate]:
        '0x0D113fA4bF2699D088CAADba089bB9774044bdF3',
    },
    seniorAPY: '10-20%',
    juniorAPY: '10-20%',
    title: 'Jia V2 Testing Pool',
    desc: 'Jia brings real-world asset returns to crypto investors while tackling the multi-trillion-dollar credit gap in emerging markets. By providing blockchain-based financing to small businesses and rewarding borrowers who repay with ownership, Jia enables them to create wealth and prosperity for themselves and their communities.',
    supplyLink: 'https://app.huma.finance',
  },
  ArfCreditPoolV2: {
    chainId: ChainEnum.Mumbai,
    poolVersion: 'v2',
    poolName: POOL_NAME.ArfCreditPoolV2,
    poolType: POOL_TYPE.ReceivableBackedCreditLine,
    pool: '0xB6E80D92A07d053e80e132d568e2775e63fd806a',
    poolConfig: '0x597a8Ede40AC4a08A7C633E8Fdf49A757AA12CA3',
    poolCredit: '0xeA69358186eDFC8867997801118523779D8655C3',
    poolCreditManager: '0xdc75FE94a1D7A1c1486B91035C3D65e422210d4c',
    poolSafe: '0x4a7321778100072D86d8fAF93e0a87F83Cff83D6',
    seniorTrancheVault: '0x4Da91D6d97701B19d558d7087DBADF89eF2ab1cd',
    juniorTrancheVault: '0x766606546Eb123409c0efFA605441b9DB3C770ef',
    epochManager: '0x57e58AD75249597ae9C363971BCD5c04dC55F02f',
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0xE8155816832E6B6F777D1aB28eeEF8ECAb7aD146',
      [FirstLossCoverIndex.affiliate]:
        '0xC431bC6843C343aeF546672Abeec6BC7692B9eAE',
    },
    seniorAPY: '10-20%',
    juniorAPY: '10-20%',
    title: 'Arf V2 Testing Pool',
    desc: 'Arf provides an innovative on-chain liquidity solution that simplifies cross-border payments by facilitating immediate USDC-based settlements and tokenizing payment orders, enhancing transparency in the process.',
    supplyLink: 'https://app.huma.finance',
  },
}
