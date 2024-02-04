import { ChainEnum } from '../../utils/chain'
import { POOL_NAME, POOL_TYPE } from '../../utils/pool'
import { FirstLossCoverIndex } from '../types'
import { KYC_PROVIDER, PoolsInfoV2 } from '../utils'

export const MUMBAI_METADATA: PoolsInfoV2 = {
  JiaV2: {
    chainId: ChainEnum.Mumbai,
    poolVersion: 'v2',
    poolName: POOL_NAME.JiaV2,
    poolType: POOL_TYPE.CreditLine,
    pool: '0x426336bD17E34eb819ddAF2bD01fF7133eC2A92F',
    poolCredit: '0x7FE5799417f7Ae90f920Ad92c5e96306fec063A0',
    poolCreditManager: '0x2ddf2cd7EA769EABbba458c85Df41BB007b53c4F',
    poolConfig: '0x6C6D75603BF6b81645B5EB760442647919882F63',
    poolSafe: '0xf492B350a83467527f10b215f23bFb123aff7448',
    seniorTrancheVault: '0xa44F0612e747fe5a9a80d7472d7c440d0892F567',
    juniorTrancheVault: '0x4417A417250D473dC026593d907C9e3f2990CB30',
    epochManager: '0xd86Dc05B308Ea4d6DEc707B99B2cef5091668588',
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0x9a23cEBCA67fA91394e6314e5Ab098E34FA5aE43',
      [FirstLossCoverIndex.admin]: '0x73f3a16afA390AD0Adf3F361c6a8c5a81d918D00',
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
  ArfCreditPoolV2: {
    chainId: ChainEnum.Mumbai,
    poolVersion: 'v2',
    poolName: POOL_NAME.ArfCreditPoolV2,
    poolType: POOL_TYPE.ReceivableBackedCreditLine,
    pool: '0xddFa7bb5514B3108189Aa67D365237e6d6DC5c96',
    poolConfig: '0xc60912F64a99bC0C5565AA9BAef35b2C12D49A5A',
    poolCredit: '0xb234367b3FAAB19a8D78D0344E39D23C6FD6d0f8',
    poolCreditManager: '0xb6F5988A4A0dCb728Ec8E2003eD1827B18Ba1780',
    poolSafe: '0x1386fAAaDCCa5E4E8Fc08A832860903eC3a5a207',
    seniorTrancheVault: '0x872C77B2586Ed290Dc88f74f29ac641BCf691c26',
    juniorTrancheVault: '0x1b0231CC83e5DA14971d96E53f735Eab46881b36',
    epochManager: '0x401B77E236F04B3f0f8Cb090D2725C61B652fc43',
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0x86fAab1051950b9B72a546B1E553eaAD1B00AE2D',
      [FirstLossCoverIndex.admin]: '0x21EB5D363ae2B9989A7EeA11De20b3170d71A264',
    },
    seniorAPY: '10-20%',
    juniorAPY: '10-20%',
    title: 'Arf V2 Testing Pool',
    desc: 'Arf provides an innovative on-chain liquidity solution that simplifies cross-border payments by facilitating immediate USDC-based settlements and tokenizing payment orders, enhancing transparency in the process.',
    supplyLink: 'https://uer4clyybno.typeform.com/arfcreditline',
  },
}
