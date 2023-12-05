import { ChainEnum } from '../../utils/chain'
import { POOL_NAME, POOL_TYPE } from '../../utils/pool'
import { FirstLossCoverIndex } from '../types'
import { PoolsInfoV2 } from '../utils'

export const MUMBAI_METADATA: PoolsInfoV2 = {
  HumaCreditLineV2: {
    chainId: ChainEnum.Mumbai,
    poolVersion: 'v2',
    poolName: POOL_NAME.HumaCreditLineV2,
    poolType: POOL_TYPE.CreditLine,
    pool: '0x0ed2c40dcd3C6Af01b386162652b8a9855BD8817',
    poolCredit: '0x9BEE397599E38f5cC399843C3718a9a5d029D92c',
    poolCreditManager: '0x40cF18670dFae8A25f80dAba87636f3e541Af968',
    poolConfig: '0x8Be3Dd949c23Ab4576b334EA98C019AC20d3d0C2',
    poolSafe: '0x247def72DFd63C87349DAC90abf306F2ec63aC0a',
    seniorTrancheVault: '0xc67A248d37B69b9877cb45d00d1797aa67b8D1f1',
    juniorTrancheVault: '0xc01B952D6ffec16e3BeDb4B716B61E5250FfEa18',
    epochManager: '0xd7a185226d73fC5AdfA5b80b5217b34060A1eB63',
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0xA60f679AAB37D210aBAb107cCc28cEb35Fcf5444',
      [FirstLossCoverIndex.affiliate]:
        '0x41512302A480e3979C5B1A194C5E3Bf64d7c3b24',
    },
    seniorAPY: '10-20%',
    juniorAPY: '10-20%',
    title: 'Huma Credit Line V2',
    desc: 'Earn active yield by participating in credit lines backed by on-chain income. Only available to the members of partner DAOs during beta.',
    KYC: {
      provider: 'Securitize',
      signInRequired: {
        title: 'Sign In',
        description:
          'Please sign in to verify that you are the owner of the wallet.',
      },
      verifyIdentity: {
        title: 'Verify Identity',
        description: `This pool is only available to accredited investors at the moment, with minimum investments of $10,000. Please complete identity verification and investor accreditation via Securitize.`,
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
    supplyLink: 'https://app.huma.finance',
  },
}
