import { ChainEnum } from '../../utils/chain'
import { POOL_NAME, POOL_TYPE } from '../../utils/pool'
import { FirstLossCoverIndex } from '../types'
import { ARF_PERSONA_KYC_COPY, PoolsInfoV2 } from '../utils'

export const SCROLL_SEPOLIA_METADATA: PoolsInfoV2 = {
  ArfCreditPool3Months: {
    chainId: ChainEnum.ScrollSepolia,
    poolVersion: 'v2',
    industry: 'Remittance Financing',
    poolName: POOL_NAME.ArfCreditPool3Months,
    poolType: POOL_TYPE.CreditLine,
    pool: '0xA457970f2d9f0EDaaf027cD581336235c9E5A669',
    poolConfig: '0x9BA2b35EA6C4fa3527B3FE4D5732f4C337DA26FA',
    poolCredit: '0x2c289b61c92Dfaf2be5968fd6367ab32AC4AD26f',
    poolCreditManager: '0xb455B4BFcA6cFA9873D90FfAdA43369009e14fd2',
    poolSafe: '0x055AA17ed23AdE6e4437f6259DF2FF1440d2D7ed',
    seniorTrancheVault: '0xdead56d2e3f64BB340aCc6245007F624639d1306',
    juniorTrancheVault: '0x9D89D7b88FcC18f0B188978eC46Bbac6b275F69b',
    epochManager: '0x2c98920D37B771868a19bDC05780623867B3727A',
    receivable: '0xd6B82e8bacFafb639Ab0CcdefdB6B45E1CCB78c2',
    poolUnderlyingToken: {
      address: '0x50dc34a634F3E29CfBad79E9cECD2759a6bA8Eae',
      symbol: 'USDC',
      decimals: 6,
      icon: 'USDC',
    },
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0xa8eD8a51245c16E218fb6A26B3cf51CF526Babd0',
      [FirstLossCoverIndex.admin]: '0xD03c8ABb544dCCcfE1495d667081152cD6B07094',
    },
    seniorAPY: '10-20%',
    juniorAPY: '10-20%',
    title: 'Arf - Cross Border Payment Financing',
    desc: 'Arf provides an innovative on-chain liquidity solution that simplifies cross-border payments by facilitating immediate USDC-based settlements and tokenizing payment orders, enhancing transparency in the process.',
    KYC: {
      Persona: ARF_PERSONA_KYC_COPY,
    },
    extra: {
      enableGetTestUSDC: true,
      rwrUploader: '0x60891b087e81ee2a61b7606f68019ec112c539b9',
    },
  },
  ArfCreditPool6Months: {
    chainId: ChainEnum.ScrollSepolia,
    poolVersion: 'v2',
    industry: 'Remittance Financing',
    poolName: POOL_NAME.ArfCreditPool6Months,
    poolType: POOL_TYPE.CreditLine,
    pool: '0xB82bEE913f0108ef871d3aa41521DcA061ddEf5F',
    poolConfig: '0x4F43DA9B1DEB62A319916a5979857c50548e1a10',
    poolCredit: '0x6015187D5bed0645d713ae6a7cf44c56c34BDe99',
    poolCreditManager: '0x7AfC92f176dd7D953c007f43c143B930541d0E55',
    poolSafe: '0x9197477E969e60bf4350542A0138072917a54c3E',
    seniorTrancheVault: '0x7cc09098f664d28d5b07E4ee822502c4A3dB08DE',
    juniorTrancheVault: '0xb6DBd8167933E1c004c0F8Ba4A06d50a2A2AaB6c',
    epochManager: '0x3DAc98fB0FD0FD4D3698302aee64c5af37a3B1Ae',
    receivable: '0x1e5bcc05b411f04f2e003dbecbd1660bce59a317',
    poolUnderlyingToken: {
      address: '0x50dc34a634F3E29CfBad79E9cECD2759a6bA8Eae',
      symbol: 'USDC',
      decimals: 6,
      icon: 'USDC',
    },
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0x7b0f2345877e3ED4C5a5706a1F6939307E121Aa8',
      [FirstLossCoverIndex.admin]: '0x9824036f7569416C3E8e8e56006a8525793B7203',
    },
    seniorAPY: '10-20%',
    juniorAPY: '10-20%',
    title: 'Arf - Cross Border Payment Financing',
    desc: 'Arf provides an innovative on-chain liquidity solution that simplifies cross-border payments by facilitating immediate USDC-based settlements and tokenizing payment orders, enhancing transparency in the process.',
    KYC: {
      Persona: ARF_PERSONA_KYC_COPY,
    },
    extra: {
      enableGetTestUSDC: true,
      rwrUploader: '0x60891b087e81ee2a61b7606f68019ec112c539b9',
    },
  },
  ArfCreditPool12Months: {
    chainId: ChainEnum.ScrollSepolia,
    poolVersion: 'v2',
    industry: 'Remittance Financing',
    poolName: POOL_NAME.ArfCreditPool12Months,
    poolType: POOL_TYPE.CreditLine,
    pool: '0xeF28cb8E19A5bf067dBAf1BE2e9bB92070023e7D',
    poolConfig: '0x1069bEed920Ca49AC9386a5dB52CD852F94A5A5A',
    poolCredit: '0xDF1Bc1444bc3950B9fa57b29181b9670b4880511',
    poolCreditManager: '0x8920ED9eAbB5D28Ad8D93f3610723d567D7aDe3C',
    poolSafe: '0xac877D92F33ffDAbFb5173eA1CcbCE5C42253f1c',
    seniorTrancheVault: '0x3A2b2c3ee4f5bA247B2eD91372Db14eA319D6764',
    juniorTrancheVault: '0xae7379910E51cec2378BAF2A5553C3aa45310acD',
    epochManager: '0xA8d737b5187Cc8eAaD0b7a97C7b04657679c5a43',
    receivable: '0x997ad2f9145c2848e02763eaa60e46cff2c06988',
    poolUnderlyingToken: {
      address: '0x50dc34a634F3E29CfBad79E9cECD2759a6bA8Eae',
      symbol: 'USDC',
      decimals: 6,
      icon: 'USDC',
    },
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0x9f02B61f14Fb919c777d1c1FF26445851F92235d',
      [FirstLossCoverIndex.admin]: '0x9D58960Fc384b1834f5679c554687F60Bd5723eC',
    },
    seniorAPY: '10-20%',
    juniorAPY: '10-20%',
    title: 'Arf - Cross Border Payment Financing',
    desc: 'Arf provides an innovative on-chain liquidity solution that simplifies cross-border payments by facilitating immediate USDC-based settlements and tokenizing payment orders, enhancing transparency in the process.',
    KYC: {
      Persona: ARF_PERSONA_KYC_COPY,
    },
    extra: {
      enableGetTestUSDC: true,
      rwrUploader: '0x60891b087e81ee2a61b7606f68019ec112c539b9',
    },
  },
  ArfCreditPoolV2: {
    chainId: ChainEnum.ScrollSepolia,
    poolVersion: 'v2',
    industry: 'Remittance Financing',
    poolName: POOL_NAME.ArfCreditPoolV2,
    poolType: POOL_TYPE.ReceivableBackedCreditLine,
    pool: '0xD0bf87bB23316317ca29d59F5758f985b67D9496',
    poolConfig: '0x77f067fbD7226bC8518BE431FBe5b73F809D925B',
    poolCredit: '0xfCF2abc68abA45e0246Fd5614dD3b54De2d28490',
    poolCreditManager: '0x9Ef6059Eb4492aaAA382f02d91e36A72bEf1f485',
    poolSafe: '0x9Fd1a276124c17A1AE17D388f02F0D3ac1f7700F',
    seniorTrancheVault: '0xE92d34e0DDb3813D24e81aa5A2ac25aec317228B',
    juniorTrancheVault: '0xDd17e41C28Cf3128CBc1Db2FAAE4154F7642F4D4',
    epochManager: '0xeDf9Aa80cCb9530e405F3886C5A021BB2115D1B7',
    receivable: '0x6dC1a2740e918940b91B30bEED4C65E912387514',
    poolUnderlyingToken: {
      address: '0x50dc34a634F3E29CfBad79E9cECD2759a6bA8Eae',
      symbol: 'USDC',
      decimals: 6,
      icon: 'USDC',
    },
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0x62CCa405a1dD603F518f998fBb25F673B037013D',
      [FirstLossCoverIndex.admin]: '0x906C7fE7128d926f0418CBCD8eb759DEe3c0E5Cb',
    },
    seniorAPY: '10-20%',
    juniorAPY: '10-20%',
    title: 'Arf V2 Testing Pool',
    desc: 'Arf provides an innovative on-chain liquidity solution that simplifies cross-border payments by facilitating immediate USDC-based settlements and tokenizing payment orders, enhancing transparency in the process.',
    KYC: {
      Persona: ARF_PERSONA_KYC_COPY,
    },
    extra: {
      hidden: true,
    },
  },
}
