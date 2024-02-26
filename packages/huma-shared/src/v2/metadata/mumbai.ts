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
    pool: '0xa890Ac3c9F8E38Be9c05BFfc0E4ECa21Bbc2FfA9',
    poolCredit: '0x088c7efb38897097Af79B42E2d0aF613FB3F6B84',
    poolCreditManager: '0x2Cdd76e6473F36eEF60a0dAB532b0a0FbcaE1466',
    poolConfig: '0x7B98dF9f33a96ff9d5d6F531B77FD14D5a1C1B9d',
    poolSafe: '0xae11afdd2AFA7BEAa4392AC9D273CAEEFddB9668',
    seniorTrancheVault: '0x7F04916F21E1B3Da281A45f88DEAf43865A50B71',
    juniorTrancheVault: '0x77F546B141432c6F00B4686eaD252Ae33d091E52',
    epochManager: '0xC3B120636EC1fCEA1E3c783E2d7A131Bb50F9E4b',
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0xe37AA81D9a9a7f48D5f4CfBc136db464B1526341',
      [FirstLossCoverIndex.admin]: '0xbA2d1382a14d9bf8d04B3bc3BA23342fE72E513D',
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
    pool: '0x210Fd4D4Da77b473E1A75605Bd17Bc5F09a3cd7d',
    poolConfig: '0x311De810825F2cc99Af9041a9f42dD24dC9788dE',
    poolCredit: '0x0C3bcB28fe9Af1a77CF6C6C55417986Ac99b37ea',
    poolCreditManager: '0x8f9DE4A80f8DA4CFCa06114Ea193F4a7a9809A26',
    poolSafe: '0xabC8a2eC634230EAE50f7971cda54f438F04F810',
    seniorTrancheVault: '0xb94a558D245707e13e08dD3cC38B37922295688c',
    juniorTrancheVault: '0xee7117B95C1fe64E9E2d5f034Fb4Ba72d831C7ae',
    epochManager: '0xcbEE08d7857e21a58D942E7713c765e6d233bbE2',
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0x29dc5A9Dfb8D3c331A44F803d49D6a04bBB43E5A',
      [FirstLossCoverIndex.admin]: '0xDD8E9F6cb30ae655C23Ccf17aB7f49bf249DC9A0',
    },
    seniorAPY: '10-20%',
    juniorAPY: '10-20%',
    title: 'Arf V2 Testing Pool',
    desc: 'Arf provides an innovative on-chain liquidity solution that simplifies cross-border payments by facilitating immediate USDC-based settlements and tokenizing payment orders, enhancing transparency in the process.',
    supplyLink: 'https://uer4clyybno.typeform.com/arfcreditline',
  },
}
