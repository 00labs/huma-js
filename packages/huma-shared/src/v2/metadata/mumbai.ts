import { ChainEnum } from '../../utils/chain'
import { POOL_NAME, POOL_TYPE } from '../../utils/pool'
import { FirstLossCoverIndex } from '../types'
import { PoolsInfoV2 } from '../utils'

export const MUMBAI_METADATA: PoolsInfoV2 = {
  JiaV2: {
    chainId: ChainEnum.Mumbai,
    poolVersion: 'v2',
    poolName: POOL_NAME.JiaV2,
    poolType: POOL_TYPE.CreditLine,
    pool: '0x9aAA78aA565fE3c7665c35eBa1405c7288FE87fD',
    poolCredit: '0x67C8589e7cdff6F95C3189cdf084d0827A31c2b3',
    poolCreditManager: '0xcF90007cea5781AF8ffaa24FdD822A4b430aAEA2',
    poolConfig: '0x06729Baea84475B40A140abEa3570DE8BC0Fe578',
    poolSafe: '0xB02e02B633941cC55e91700AAB713E751025289a',
    seniorTrancheVault: '0xe70093C6eaa449a0e4a5cBF50A956E7de9cFd70f',
    juniorTrancheVault: '0xCf4930B2be58830DdD7332dC91B972a3307F0D17',
    epochManager: '0xd0281AbadF9ECe5955a140Ac0204C9b05339B5cD',
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0x3e669D8f5f2bd62998785aA763D1E617A00FF6c7',
      [FirstLossCoverIndex.affiliate]:
        '0x314396123Cf6D56502D8B2cc13ab36a4A63070F4',
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
