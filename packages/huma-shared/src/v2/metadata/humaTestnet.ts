import { ChainEnum } from '../../utils/chain'
import { POOL_NAME, POOL_TYPE } from '../../utils/pool'
import { FirstLossCoverIndex } from '../types'
import { KYC_PROVIDER, PoolsInfoV2 } from '../utils'

export const HUMA_TESTNET_METADATA: PoolsInfoV2 = {
  JiaV2: {
    chainId: ChainEnum.HumaTestnet,
    poolVersion: 'v2',
    industry: 'Supply Chain Financing',
    poolName: POOL_NAME.JiaV2,
    poolType: POOL_TYPE.CreditLine,
    pool: '0x3d38068977323BD88F5e8F853536f19a096EB29F',
    poolConfig: '0xf1f0bE0Ba6b279d3Ee5198A949A17c01BF0B79Af',
    poolCredit: '0x1982f6c096A58ADef57F43e6c18aC4aF6D6e5d33',
    poolCreditManager: '0xa64b13dEfBba5EfE149B16FfCbD0a8138A172C1e',
    poolSafe: '0x3b507540C6f7FaA32FB52C93ae9989DC5eDDC13f',
    seniorTrancheVault: '0x64B2a42C1f69F35bCB4abAbadfAC8b681D15Cd70',
    juniorTrancheVault: '0x848C97580F8C5f9E194CBf5E70463417c5c70CcF',
    epochManager: '0x3Abf059E221d82c290aCa12B6DE3fdF4d64b5f5E',
    poolUnderlyingToken: {
      address: '0x0165878A594ca255338adfa4d48449f69242Eb8F',
      symbol: 'USDC',
      decimals: 6,
      icon: 'USDC',
    },
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0x64e605642C1343f5d9D7151fC7a54dED81145741',
      [FirstLossCoverIndex.admin]: '0xAb5d17DEa5D7CE84aEcCa3Db8feBFdb3786c188f',
    },
    seniorAPY: '10-20%',
    juniorAPY: '10-20%',
    title: 'Jia V2 Testing Pool',
    desc: 'Jia brings real-world asset returns to crypto investors while tackling the multi-trillion-dollar credit gap in emerging markets. By providing blockchain-based financing to small businesses and rewarding borrowers who repay with ownership, Jia enables them to create wealth and prosperity for themselves and their communities.',
    KYC: {
      Securitize: {
        signInRequired: {
          title: 'Sign In',
          description:
            'Please sign in to verify that you are the owner of the wallet.',
        },
        verifyIdentity: {
          title: 'Verify Identity',
          description: `This pool is only available to professional/accredited investors at the moment, with minimum investments of $10,000. Please complete identity verification and investor accreditation via ${KYC_PROVIDER.Securitize}.`,
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
  },
  ArfCreditPoolV2: {
    chainId: ChainEnum.HumaTestnet,
    poolVersion: 'v2',
    industry: 'Remittance Financing',
    poolName: POOL_NAME.ArfCreditPoolV2,
    poolType: POOL_TYPE.ReceivableBackedCreditLine,
    pool: '0xa3275668ebDad74bC1eCEd227410BF3d62414Ccc',
    poolConfig: '0xE98558FE861880631a30Aa54A9EDc2e0f26d980F',
    poolCredit: '0x6F7F2b9f69992572a67847b9a489d534A5C64681',
    poolCreditManager: '0x0BD888937c8965CcC18AD9a9bB6A8433315FE56D',
    poolSafe: '0x25FF0E3c04834B51442E38E349B11DC5902d28C0',
    seniorTrancheVault: '0xBBd6abFb659974300BEe318C3c2C69c268d3788b',
    juniorTrancheVault: '0xa53Fd5659Fb9Ef172CAd7301459656b0eadb8ff7',
    epochManager: '0x3c2e19A2AdEc4344dD91425cc91288336F0DD961',
    poolUnderlyingToken: {
      address: '0x04C89607413713Ec9775E14b954286519d836FEf',
      symbol: 'USDC',
      decimals: 6,
      icon: 'USDC',
    },
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0x3011866c9feC8476622c7aeDb55a0fEB60955356',
      [FirstLossCoverIndex.admin]: '0x3Be5057A36a04710dE059e3407f9b7F10a3E17Cc',
    },
    seniorAPY: '10-20%',
    juniorAPY: '10-20%',
    title: 'Arf V2 Testing Pool',
    desc: 'Arf provides an innovative on-chain liquidity solution that simplifies cross-border payments by facilitating immediate USDC-based settlements and tokenizing payment orders, enhancing transparency in the process.',
    supplyLink: 'https://uer4clyybno.typeform.com/arfcreditline',
  },
}
