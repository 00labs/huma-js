import { ChainEnum } from '../../utils/chain'
import { POOL_NAME, POOL_TYPE } from '../../utils/pool'
import { FirstLossCoverIndex } from '../types'
import { KYC_PROVIDER, PoolsInfoV2 } from '../utils'

export const LOCALHOST_METADATA: PoolsInfoV2 = {
  JiaV2: {
    chainId: ChainEnum.Localhost,
    poolVersion: 'v2',
    poolName: POOL_NAME.JiaV2,
    poolType: POOL_TYPE.CreditLine,
    pool: '0xc6e7DF5E7b4f2A278906862b61205850344D4e7d',
    poolConfig: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
    poolCredit: '0x67d269191c92Caf3cD7723F116c85e6E9bf55933',
    poolCreditManager: '0xc3e53F4d16Ae77Db1c982e75a937B9f60FE63690',
    poolSafe: '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0',
    seniorTrancheVault: '0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f',
    juniorTrancheVault: '0x7a2088a1bFc9d81c55368AE168C2C02570cB814F',
    epochManager: '0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1',
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0x9A676e781A523b5d0C0e43731313A708CB607508',
      [FirstLossCoverIndex.admin]: '0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1',
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
    chainId: ChainEnum.Localhost,
    poolVersion: 'v2',
    poolName: POOL_NAME.ArfCreditPoolV2,
    poolType: POOL_TYPE.ReceivableBackedCreditLine,
    pool: '0x4EE6eCAD1c2Dae9f525404De8555724e3c35d07B',
    poolConfig: '0x4C4a2f8c81640e47606d3fd77B353E87Ba015584',
    poolCredit: '0x4C2F7092C2aE51D986bEFEe378e50BD4dB99C901',
    poolCreditManager: '0x49fd2BE640DB2910c2fAb69bB8531Ab6E76127ff',
    poolSafe: '0xDC11f7E700A4c898AE5CAddB1082cFfa76512aDD',
    seniorTrancheVault: '0xfbC22278A96299D91d41C453234d97b4F5Eb9B2d',
    juniorTrancheVault: '0xC9a43158891282A2B1475592D5719c001986Aaec',
    epochManager: '0xD84379CEae14AA33C123Af12424A37803F885889',
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0x36b58F5C1969B7b6591D752ea6F5486D069010AB',
      [FirstLossCoverIndex.admin]: '0x0355B7B8cb128fA5692729Ab3AAa199C1753f726',
    },
    seniorAPY: '10-20%',
    juniorAPY: '10-20%',
    title: 'Arf V2 Testing Pool',
    desc: 'Arf provides an innovative on-chain liquidity solution that simplifies cross-border payments by facilitating immediate USDC-based settlements and tokenizing payment orders, enhancing transparency in the process.',
    supplyLink: 'https://uer4clyybno.typeform.com/arfcreditline',
  },
}
