import { ChainEnum } from '../../utils/chain'
import { POOL_NAME, POOL_TYPE } from '../../utils/pool'
import { FirstLossCoverIndex } from '../types'
import { ARF_PERSONA_KYC_COPY, PoolsInfoV2 } from '../utils'

export const BASE_SEPOLIA_METADATA: PoolsInfoV2 = {
  // JiaV2: {
  //   chainId: ChainEnum.BaseSepolia,
  //   poolVersion: 'v2',
  //   industry: 'Supply Chain Financing',
  //   poolName: POOL_NAME.JiaV2,
  //   poolType: POOL_TYPE.CreditLine,
  //   pool: '0x3e7Cb3f245bdC1BeEe925a2E11c20492553DBE15',
  //   poolCredit: '0xB53cBA8FD7984FAc2C169c2Ae9Ff0186c593D836',
  //   poolCreditManager: '0x0Fb60e17b03F92bDE5c7C93C6fD4DafD92380272',
  //   poolConfig: '0xaFFd1DAd2930A1060849AEac611d80Fc0b475cC1',
  //   poolSafe: '0x25c19737663B7c34c2203e52A6583456309754Bc',
  //   seniorTrancheVault: '0x06ee659DEdE8E56beaa1d2fAF5562F2BF690998C',
  //   juniorTrancheVault: '0x2074aD5c2FAC45C30d1BD1819232762921653065',
  //   epochManager: '0x0714d912C0437B6F9AaCB59E60433d8935473613',
  //   poolUnderlyingToken: {
  //     address: '0x8ca2b9b00420d51D697b59E84720c9B1A0b11d27',
  //     symbol: 'USDC',
  //     decimals: 6,
  //     icon: 'USDC',
  //   },
  //   firstLossCovers: {
  //     [FirstLossCoverIndex.borrower]:
  //       '0x7E1D981Ee07f4e65a6249bdD8A1681F102af1894',
  //     [FirstLossCoverIndex.admin]: '0xE901b319230469ee158D3923730784E9bE152745',
  //   },
  //   seniorAPY: '10-20%',
  //   juniorAPY: '10-20%',
  //   title: 'Jia V2 Testing Pool',
  //   desc: 'Jia brings real-world asset returns to crypto investors while tackling the multi-trillion-dollar credit gap in emerging markets. By providing blockchain-based financing to small businesses and rewarding borrowers who repay with ownership, Jia enables them to create wealth and prosperity for themselves and their communities.',
  //   KYC: {
  //     Securitize: {
  //       signInRequired: {
  //         title: 'Sign In',
  //         description:
  //           'Please sign in to verify that you are the owner of the wallet.',
  //       },
  //       verifyIdentity: {
  //         title: 'Verify Identity',
  //         description: `This pool is only available to accredited investors at the moment, with minimum investments of $10,000. Please complete identity verification and investor accreditation via ${KYC_PROVIDER.Securitize}.`,
  //         buttonText: 'VERIFY MY IDENTITY',
  //       },
  //       emailSignatureLink: {
  //         title: 'Pool Documents',
  //         description: `By lending to this pool, you become a subscriber member of the Jia Pioneer Fund LLC. Please sign the LLC Agreement via DocuSign, securing your off-chain claim to the Fund's returns and collateral.`,
  //         buttonText: 'EMAIL DOCUSIGN LINK',
  //       },
  //       resendSignatureLink: {
  //         title: 'Resend Documents',
  //         description: `Please check your inbox for the LLC Agreement sent via DocuSign. If you haven't received it, check your spam folder or click below to resend.`,
  //         buttonText: 'RESEND DOCUSIGN LINK',
  //       },
  //       docUnderReview: {
  //         title: 'Under Review',
  //         description:
  //           'Your documents are being reviewed and you will be notified upon approval. Thank you for your patience. Any questions? Email invest@jia.xyz.',
  //         buttonText: 'THANK YOU',
  //       },
  //     },
  //   },
  // },
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
