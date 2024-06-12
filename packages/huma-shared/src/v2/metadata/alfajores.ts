import { ChainEnum } from '../../utils/chain'
import { POOL_NAME, POOL_TYPE } from '../../utils/pool'
import { FirstLossCoverIndex } from '../types'
import { PoolsInfoV2 } from '../utils'

export const ALFAJORES_METADATA: PoolsInfoV2 = {
  ArfCreditPoolV2: {
    chainId: ChainEnum.Alfajores,
    poolVersion: 'v2',
    industry: 'Remittance Financing',
    poolName: POOL_NAME.ArfCreditPoolV2,
    poolType: POOL_TYPE.ReceivableBackedCreditLine,
    pool: '0xc324e091bbdf681b28d07f2e98774c3465c03bCb',
    poolConfig: '0x1ad35eb7d600039d4707817b8093a89e388da5c1',
    poolCredit: '0x14b11f2fda011b6277a21e77a8e312b4b1d53c59',
    poolCreditManager: '0x82f6d4ea15ed9b4f5a49fec82748469e2c58c763',
    poolSafe: '0x90540caa8573b577369d2a14821ece6373c40529',
    seniorTrancheVault: '0x9a534eb31c7858fbf90361939f648d16c6576f55',
    juniorTrancheVault: '0x70f977516ed2d4a96e155b6c9f9546932298b241',
    epochManager: '0xdfba71d2d20dac522d38a9b513056e7cdcc877f0',
    receivable: '0x5D1F2f000ef0C42bDa974E30d32145bcCaAec77c',
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0xb45E27781cbA4E61332adb5d32AB6f64fA316759',
      [FirstLossCoverIndex.admin]: '0xd4E748A822FAc98D2CCC4645D85B7d2964726f7f',
    },
    seniorAPY: '10-20%',
    juniorAPY: '10-20%',
    title: 'Arf V2 Testing Pool',
    desc: 'Arf provides an innovative on-chain liquidity solution that simplifies cross-border payments by facilitating immediate USDC-based settlements and tokenizing payment orders, enhancing transparency in the process.',
    supplyLink: 'https://uer4clyybno.typeform.com/arfcreditline',
  },
}
