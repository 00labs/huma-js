import { ChainEnum } from '../../utils/chain'
import { POOL_NAME, POOL_TYPE } from '../../utils/pool'
import { FirstLossCoverIndex } from '../types'
import { ARF_PERSONA_KYC_COPY, PoolsInfoV2 } from '../utils'

export const SCROLL_METADATA: PoolsInfoV2 = {
  ArfCreditPool3Months: {
    chainId: ChainEnum.Scroll,
    poolVersion: 'v2',
    industry: 'Remittance Financing',
    poolName: POOL_NAME.ArfCreditPool3Months,
    poolType: POOL_TYPE.ReceivableBackedCreditLine,
    pool: '0x51051d2E2bac59b525C7f001E91d31193c4CafFe',
    poolConfig: '0xcEC52856813d5061FdCDEC8A7464B685294c5cad',
    poolCredit: '0x7eb695ad4D4ffC80548b520F3f0E277b14c564db',
    poolCreditManager: '0xA4Ab74C3618Eda38DB4E63bA4D91fb5b9aB2b209',
    poolSafe: '0x7DFB8cF225e760D69939496eE6BaDA4d660D351b',
    seniorTrancheVault: '0xD8208374c5E358031e7A81392F705c04106bB990',
    juniorTrancheVault: '0xB135B9cfE868D456B5Fa480817E830960BdE80b3',
    epochManager: '0x7297862107E73794BF44332B1654bf3708018310',
    receivable: '0x89B599dCc82c42Ef2f17ae39c44e4F6764003518',
    poolUnderlyingToken: {
      address: '0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4',
      symbol: 'USDC',
      decimals: 6,
      icon: 'USDC',
    },
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0xb3629a52e5FC292d1f0f8EB927ADabe872b5e5a3',
      [FirstLossCoverIndex.admin]: '0xc4E07CFa7Ae39f595895B43bd35dc078f7FE6eF1',
    },
    seniorAPY: '10-20%',
    juniorAPY: '10-20%',
    title: 'Arf - Cross Border Payment Financing',
    desc: 'Arf provides an innovative on-chain liquidity solution that simplifies cross-border payments by facilitating immediate USDC-based settlements and tokenizing payment orders, enhancing transparency in the process.',
    KYC: {
      Persona: ARF_PERSONA_KYC_COPY,
    },
    extra: {
      borrower: '0x08534d9b632a7A35d7af4aAe5d487A15FC247691',
    },
  },
  ArfCreditPool6Months: {
    chainId: ChainEnum.Scroll,
    poolVersion: 'v2',
    industry: 'Remittance Financing',
    poolName: POOL_NAME.ArfCreditPool6Months,
    poolType: POOL_TYPE.ReceivableBackedCreditLine,
    pool: '0x1900e417869691277cfd20f4001b768B03375272',
    poolConfig: '0x8A89942cda613BB9Dc7a8eF6Dbdc788EE3F29410',
    poolCredit: '0x2e3A03C8Bd31300C2c027C9C9d1b762677F6FaA6',
    poolCreditManager: '0xbC015F64b023d8B351484342d35dA0AF0d42a9de',
    poolSafe: '0xD6C357c40731a1F57173231eeeAb004eD8baE9b6',
    seniorTrancheVault: '0xDe5eD603A376B93817b9656AF6E373218fD9b2bd',
    juniorTrancheVault: '0x8413a7345cD8bF8Afe8c2EfE866a764A93B305e2',
    epochManager: '0x648186Cf2a78AB9356C82ec29EDA42798453C8d6',
    receivable: '0x89B599dCc82c42Ef2f17ae39c44e4F6764003518',
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
    extra: {
      borrower: '0x08534d9b632a7A35d7af4aAe5d487A15FC247691',
    },
  },
}
