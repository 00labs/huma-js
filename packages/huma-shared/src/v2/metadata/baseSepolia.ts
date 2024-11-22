import { ChainEnum } from '../../utils/chain'
import { POOL_NAME, POOL_TYPE } from '../../utils/pool'
import { FirstLossCoverIndex } from '../types'
import { ARF_PERSONA_KYC_COPY, PoolsInfoV2 } from '../utils'

export const BASE_SEPOLIA_METADATA: PoolsInfoV2 = {
  ArfCreditPoolV2: {
    chainId: ChainEnum.BaseSepolia,
    poolVersion: 'v2',
    industry: 'Remittance Financing',
    poolName: POOL_NAME.ArfCreditPoolV2,
    poolType: POOL_TYPE.ReceivableBackedCreditLine,
    pool: '0x3611037825B538e0EE0b48D48BAaAEc7d24486Ac',
    poolConfig: '0x9421647c3491d6d19b7233ad59A54413197fd2e1',
    poolCredit: '0x32C7b1CA98Ee7365A2CDe915A4d47e261fb30C75',
    poolCreditManager: '0x935f872FE84dDC3c9f26f40abC9b9cB032E08367',
    poolSafe: '0x4B357A8d21DB9feDF44eEF071Edaf629B4f34a37',
    seniorTrancheVault: '0x21eFCabdB6bbaFFcF21ab98CC1ea6FafB866647f',
    juniorTrancheVault: '0xf5783e47534D4a988C46FDdD4b6952A97157aE5C',
    epochManager: '0xCaef6534A26785730d544Bc3B066e1528Fb70484',
    receivable: '0x8F463C6e3FFDEb75581625Fcfdc26D5650Afc9ed',
    poolUnderlyingToken: {
      address: '0x8ca2b9b00420d51D697b59E84720c9B1A0b11d27',
      symbol: 'USDC',
      decimals: 6,
      icon: 'USDC',
    },
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0xB295459175ADb5e9C855F1aea4e7048d742Dc3f8',
      [FirstLossCoverIndex.admin]: '0x7850D31b368D4E75c95b6415a99351D920C8793E',
    },
    seniorAPY: '10-20%',
    juniorAPY: '10-20%',
    title: 'Arf V2 Testing Pool',
    desc: 'Arf provides an innovative on-chain liquidity solution that simplifies cross-border payments by facilitating immediate USDC-based settlements and tokenizing payment orders, enhancing transparency in the process.',
    KYC: {
      Persona: ARF_PERSONA_KYC_COPY,
    },
    extra: {
      enableGetTestUSDC: true,
      hidden: true,
    },
  },
}
