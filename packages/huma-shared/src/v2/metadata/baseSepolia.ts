import { ChainEnum } from '../../utils/chain'
import { POOL_NAME, POOL_TYPE } from '../../utils/pool'
import { FirstLossCoverIndex } from '../types'
import { KYC_PROVIDER, PoolsInfoV2 } from '../utils'

export const BASE_SEPOLIA_METADATA: PoolsInfoV2 = {
  JiaV2: {
    chainId: ChainEnum.BaseSepolia,
    poolVersion: 'v2',
    poolName: POOL_NAME.JiaV2,
    poolType: POOL_TYPE.CreditLine,
    pool: '0x3e7Cb3f245bdC1BeEe925a2E11c20492553DBE15',
    poolCredit: '0xB53cBA8FD7984FAc2C169c2Ae9Ff0186c593D836',
    poolCreditManager: '0x0Fb60e17b03F92bDE5c7C93C6fD4DafD92380272',
    poolConfig: '0xaFFd1DAd2930A1060849AEac611d80Fc0b475cC1',
    poolSafe: '0x25c19737663B7c34c2203e52A6583456309754Bc',
    seniorTrancheVault: '0x06ee659DEdE8E56beaa1d2fAF5562F2BF690998C',
    juniorTrancheVault: '0x2074aD5c2FAC45C30d1BD1819232762921653065',
    epochManager: '0x0714d912C0437B6F9AaCB59E60433d8935473613',
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0x7E1D981Ee07f4e65a6249bdD8A1681F102af1894',
      [FirstLossCoverIndex.admin]: '0xE901b319230469ee158D3923730784E9bE152745',
    },
    seniorAPY: '10-20%',
    juniorAPY: '10-20%',
    title: 'Jia V2 Testing Pool',
    desc: 'Jia brings real-world asset returns to crypto investors while tackling the multi-trillion-dollar credit gap in emerging markets. By providing blockchain-based financing to small businesses and rewarding borrowers who repay with ownership, Jia enables them to create wealth and prosperity for themselves and their communities.',
    KYC: {
      provider: KYC_PROVIDER.Securitize,
      signInRequired: {
        title: 'Sign In',
        description:
          'Please sign in to verify that you are the owner of the wallet.',
      },
      verifyIdentity: {
        title: 'Verify Identity',
        description: `This pool is only available to accredited investors at the moment, with minimum investments of $10,000. Please complete identity verification and investor accreditation via ${KYC_PROVIDER.Securitize}.`,
        buttonText: 'VERIFY MY IDENTITY',
      },
      emailSignatureLink: {
        title: 'Pool Documents',
        description: `By lending to this pool, you become a subscriber member of the Jia Pioneer Fund LLC. Please sign the LLC Agreement via DocuSign, securing your off-chain claim to the Fund's returns and collateral.`,
        buttonText: 'EMAIL DOCUSIGN LINK',
      },
      resendSignatureLink: {
        title: 'Resend Documents',
        description: `Please check your inbox for the LLC Agreement sent via DocuSign. If you haven't received it, check your spam folder or click below to resend.`,
        buttonText: 'RESEND DOCUSIGN LINK',
      },
      docUnderReview: {
        title: 'Under Review',
        description:
          'Your documents are being reviewed and you will be notified upon approval. Thank you for your patience. Any questions? Email invest@jia.xyz.',
        buttonText: 'THANK YOU',
      },
    },
  },
}
