import { ChainEnum } from '../../utils/chain'
import { POOL_NAME, POOL_TYPE } from '../../utils/pool'
import { FirstLossCoverIndex } from '../types'
import { KYC_PROVIDER, PoolsInfoV2 } from '../utils'

export const HUMA_TESTNET_METADATA: PoolsInfoV2 = {
  JiaV2: {
    chainId: ChainEnum.HumaTestnet,
    poolVersion: 'v2',
    poolName: POOL_NAME.JiaV2,
    poolType: POOL_TYPE.CreditLine,
    pool: '0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44',
    poolConfig: '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e',
    poolCredit: '0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB',
    poolCreditManager: '0x851356ae760d987E095750cCeb3bC6014560891C',
    poolSafe: '0x0B306BF915C4d645ff596e518fAf3F9669b97016',
    seniorTrancheVault: '0x09635F643e140090A9A8Dcd712eD6285858ceBef',
    juniorTrancheVault: '0x67d269191c92Caf3cD7723F116c85e6E9bf55933',
    epochManager: '0x4A679253410272dd5232B3Ff7cF5dbB88f295319',
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE',
      [FirstLossCoverIndex.affiliate]:
        '0x3Aa5ebB10DC797CAC828524e59A333d0A371443c',
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
    chainId: ChainEnum.HumaTestnet,
    poolVersion: 'v2',
    poolName: POOL_NAME.ArfCreditPoolV2,
    poolType: POOL_TYPE.ReceivableBackedCreditLine,
    pool: '0x1c85638e118b37167e9298c2268758e058DdfDA0',
    poolConfig: '0x8198f5d8F8CfFE8f9C413d98a0A55aEB8ab9FbB7',
    poolCredit: '0xAA292E8611aDF267e563f334Ee42320aC96D0463',
    poolCreditManager: '0x5067457698Fd6Fa1C6964e416b3f42713513B3dD',
    poolSafe: '0x172076E0166D1F9Cc711C77Adf8488051744980C',
    seniorTrancheVault: '0x49fd2BE640DB2910c2fAb69bB8531Ab6E76127ff',
    juniorTrancheVault: '0x86A2EE8FAf9A840F7a2c64CA3d51209F9A02081D',
    epochManager: '0x4C2F7092C2aE51D986bEFEe378e50BD4dB99C901',
    firstLossCovers: {
      [FirstLossCoverIndex.borrower]:
        '0xBEc49fA140aCaA83533fB00A2BB19bDdd0290f25',
      [FirstLossCoverIndex.affiliate]:
        '0x2B0d36FACD61B71CC05ab8F3D2355ec3631C0dd5',
    },
    seniorAPY: '10-20%',
    juniorAPY: '10-20%',
    title: 'Arf V2 Testing Pool',
    desc: 'Arf provides an innovative on-chain liquidity solution that simplifies cross-border payments by facilitating immediate USDC-based settlements and tokenizing payment orders, enhancing transparency in the process.',
    supplyLink: 'https://uer4clyybno.typeform.com/arfcreditline',
  },
}
