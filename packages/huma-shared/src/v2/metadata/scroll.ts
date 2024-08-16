import { ChainEnum } from '../../utils/chain'
import { POOL_NAME, POOL_TYPE } from '../../utils/pool'
import { FirstLossCoverIndex } from '../types'
import { PERSONA_KYC_COPY, PoolsInfoV2 } from '../utils'

export const SCROLL_METADATA: PoolsInfoV2 = {
  ArfCreditPoolV2: {
    chainId: ChainEnum.Scroll,
    poolVersion: 'v2',
    industry: 'Remittance Financing',
    poolName: POOL_NAME.ArfCreditPoolV2,
    poolType: POOL_TYPE.CreditLine,
    pool: '0x5227254a6aCa397e95F310b52f6D3143A5A9Ee14',
    poolConfig: '0xebf8D31C5492Dc93FC73a6AD136d47c45AB2C7a5',
    poolCredit: '0xc6F10af4746784a0DD095f4E5718d53ff94eB4a0',
    poolCreditManager: '0x061411d05074Bc974f814AC86309D2204f4c265d',
    poolSafe: '0x7F4f55fAeE753D8dbB3E5F04861dB38E9DB70c3D',
    seniorTrancheVault: '0x4cdCedcF50266aD9ed809048BC9874320EC902bC',
    juniorTrancheVault: '0x483D02C11f8F1E31C267040A6C86AaB80c428BaB',
    epochManager: '0x1a2C87Be5e785493310526faA7739Bbe4E10c0F6',
    poolUnderlyingToken: {
      address: '0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4',
      symbol: 'USDC',
      decimals: 6,
      icon: 'USDC',
    },
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0xceA6753113741f82A7a3d86355D4d9BB7126F25E',
      [FirstLossCoverIndex.admin]: '0x4222372912cc6554a11ecBeC141cBf6b7d62B630',
    },
    seniorAPY: '10-20%',
    juniorAPY: '10-20%',
    title: 'Arf Credit Pool v2',
    desc: 'Arf provides an innovative on-chain liquidity solution that simplifies cross-border payments by facilitating immediate USDC-based settlements and tokenizing payment orders, enhancing transparency in the process.',
    KYC: {
      Persona: PERSONA_KYC_COPY,
    },
    extra: {
      enableGetTestUSDC: true,
    },
  },
}
