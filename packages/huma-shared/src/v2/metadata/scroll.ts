import { ChainEnum } from '../../utils/chain'
import { POOL_NAME, POOL_TYPE } from '../../utils/pool'
import { FirstLossCoverIndex } from '../types'
import { ARF_PERSONA_KYC_COPY, PoolsInfoV2 } from '../utils'

export const SCROLL_METADATA: PoolsInfoV2 = {
  ArfCreditPool3Months: {
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
    title: 'Arf - Cross Border Payment Financing',
    desc: 'Arf provides an innovative on-chain liquidity solution that simplifies cross-border payments by facilitating immediate USDC-based settlements and tokenizing payment orders, enhancing transparency in the process.',
    KYC: {
      Persona: ARF_PERSONA_KYC_COPY,
    },
  },
  ArfCreditPool6Months: {
    chainId: ChainEnum.Scroll,
    poolVersion: 'v2',
    industry: 'Remittance Financing',
    poolName: POOL_NAME.ArfCreditPoolV2,
    poolType: POOL_TYPE.CreditLine,
    pool: '0x1900e417869691277cfd20f4001b768B03375272',
    poolConfig: '0xE9D7893B52BE6D81C540f2E81f3A65FAbF8A0fa4',
    poolCredit: '0x2e3A03C8Bd31300C2c027C9C9d1b762677F6FaA6',
    poolCreditManager: '0xbC015F64b023d8B351484342d35dA0AF0d42a9de',
    poolSafe: '0xD6C357c40731a1F57173231eeeAb004eD8baE9b6',
    seniorTrancheVault: '0xDe5eD603A376B93817b9656AF6E373218fD9b2bd',
    juniorTrancheVault: '0x8413a7345cD8bF8Afe8c2EfE866a764A93B305e2',
    epochManager: '0x648186Cf2a78AB9356C82ec29EDA42798453C8d6',
    poolUnderlyingToken: {
      address: '0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4',
      symbol: 'USDC',
      decimals: 6,
      icon: 'USDC',
    },
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0xA2A7851D62aEe4dE259b15C11af961bb50a2147e',
      [FirstLossCoverIndex.admin]: '0x5BaBd32EEb522b891911ce9C184aaEC65A5CEBE9',
    },
    seniorAPY: '10-20%',
    juniorAPY: '10-20%',
    title: 'Arf - Cross Border Payment Financing',
    desc: 'Arf provides an innovative on-chain liquidity solution that simplifies cross-border payments by facilitating immediate USDC-based settlements and tokenizing payment orders, enhancing transparency in the process.',
    KYC: {
      Persona: ARF_PERSONA_KYC_COPY,
    },
  },
}
