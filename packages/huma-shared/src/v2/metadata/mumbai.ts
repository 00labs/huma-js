import { ChainEnum } from '../../utils/chain'
import { POOL_NAME, POOL_TYPE } from '../../utils/pool'
import POOL_ABI from '../abis/Pool.json'
import POOL_SAFE_ABI from '../abis/PoolSafe.json'
import POOL_CONFIG_ABI from '../abis/PoolConfig.json'
import TRANCHE_VAULT_ABI from '../abis/TrancheVault.json'
import FIRST_LOSS_COVER_ABI from '../abis/FirstLossCover.json'
import { PoolsInfoV2 } from '../utils'

export const MUMBAI_METADATA: PoolsInfoV2 = {
  HumaCreditLineV2: {
    chainId: ChainEnum.Mumbai,
    poolVersion: 'v2',
    poolName: POOL_NAME.HumaCreditLineV2,
    poolType: POOL_TYPE.CreditLine,
    pool: '0x3Eb397BaBdd57E3a37a9fce7aADa11Bbc85a8429',
    poolConfig: '0xC662f70b755Fd4E027367793A2Fe8385EDa85785',
    poolCredit: '',
    poolSafe: '0xca5bFcC7ec24f2222853176a0caDe98db4606D05',
    seniorTrancheVault: '0xed674Dc30ED04b8FB2a97a23AF0EBA8c076d5ca0',
    juniorTrancheVault: '0x3234Cf74Aef57CC2A69f47d693e38D5272C41Ec5',
    poolAbi: POOL_ABI,
    poolSafeAbi: POOL_SAFE_ABI,
    poolConfigAbi: POOL_CONFIG_ABI,
    trancheVaultAbi: TRANCHE_VAULT_ABI,
    firstLossCoverAbi: FIRST_LOSS_COVER_ABI,
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
