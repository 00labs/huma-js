import { ChainEnum } from '../../utils/chain'
import { POOL_NAME, POOL_TYPE } from '../../utils/pool'
import { FirstLossCoverIndex } from '../types'
import { PoolsInfoV2 } from '../utils'

export const ALFAJORES_METADATA: PoolsInfoV2 = {
  ArfCreditPoolV2: {
    chainId: ChainEnum.Alfajores,
    poolVersion: 'v2',
    industry: 'Remittance Financing',
    poolName: POOL_NAME.ArfCreditPoolV2,
    poolType: POOL_TYPE.ReceivableBackedCreditLine,
    pool: '0xc324e091bbdf681b28d07f2e98774c3465c03bCb',
    poolConfig: '0x1ad35eb7d600039d4707817b8093a89e388da5c1',
    poolCredit: '0x14b11f2fda011b6277a21e77a8e312b4b1d53c59',
    poolCreditManager: '0x82f6d4ea15ed9b4f5a49fec82748469e2c58c763',
    poolSafe: '0x90540caa8573b577369d2a14821ece6373c40529',
    seniorTrancheVault: '0x9a534eb31c7858fbf90361939f648d16c6576f55',
    juniorTrancheVault: '0x70f977516ed2d4a96e155b6c9f9546932298b241',
    epochManager: '0xdfba71d2d20dac522d38a9b513056e7cdcc877f0',
    receivable: '0x5D1F2f000ef0C42bDa974E30d32145bcCaAec77c',
    poolUnderlyingToken: {
      address: '0x6548f5146c8deA61C4C7269988DDfB22BC431cd2',
      symbol: 'USDC',
      decimals: 6,
      icon: 'USDC',
    },
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0xb45E27781cbA4E61332adb5d32AB6f64fA316759',
      [FirstLossCoverIndex.admin]: '0xd4E748A822FAc98D2CCC4645D85B7d2964726f7f',
    },
    seniorAPY: '10-20%',
    juniorAPY: '10-20%',
    title: 'Arf V2 Testing Pool',
    desc: 'Arf provides an innovative on-chain liquidity solution that simplifies cross-border payments by facilitating immediate USDC-based settlements and tokenizing payment orders, enhancing transparency in the process.',
    // supplyLink: 'https://uer4clyybno.typeform.com/arfcreditline',
    KYC: {
      provider: 'Securitize',
      signInRequired: {
        title: 'Sign In',
        description:
          'Please sign in to verify that you are the owner of the wallet.',
      },
      verifyIdentity: {
        title: 'Verify Identity',
        description: `This pool is only available to accredited investors at the moment, with minimum investments of $10,000. Please complete identity verification and investor accreditation via Persona.`,
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
