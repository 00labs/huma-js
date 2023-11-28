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
    pool: '0x65e42480c03d0757ed4819C722DD5B26EF8eB88B',
    poolCredit: '0x0652dE7EEC37354c78B2F115ceB4b57BD745D00D',
    poolConfig: '0xd329f594067C78C747d3A22565d93498DD455B08',
    poolSafe: '0x836BD38c0628C5760905feD05bB54c12D5f4D37A',
    seniorTrancheVault: '0x799d542684508730e00A9186d4a2756d2b386459',
    juniorTrancheVault: '0x1d0797B67834b1bB127B10933c40751B9046979c',
    epochManager: '0x4f71aC8D39ceB7EAFb8001574343646C3A12C831',
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0x36F56698BCc4374d82a8765A1CAfbcd65820B04a',
      [FirstLossCoverIndex.affiliate]:
        '0x1888b552DC5fC2d8B432C0f6cB54844Ec9f8a759',
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
