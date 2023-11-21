import { ChainEnum } from '../../utils/chain'
import { POOL_NAME, POOL_TYPE } from '../../utils/pool'
import POOL_ABI from '../abis/Pool.json'
import POOL_SAFE_ABI from '../abis/PoolSafe.json'
import POOL_CONFIG_ABI from '../abis/PoolConfig.json'
import TRANCHE_VAULT_ABI from '../abis/TrancheVault.json'
import FIRST_LOSS_COVER_ABI from '../abis/FirstLossCover.json'
import EPOCH_MANAGER_ABI from '../abis/EpochManager.json'
import { PoolsInfoV2 } from '../utils'

export const MUMBAI_METADATA: PoolsInfoV2 = {
  HumaCreditLineV2: {
    chainId: ChainEnum.Mumbai,
    poolVersion: 'v2',
    poolName: POOL_NAME.HumaCreditLineV2,
    poolType: POOL_TYPE.CreditLine,
    pool: '0xF265Ae2a0614648eEf254f2a4E446DC9c8cFC6F7',
    poolCredit: '',
    poolConfig: '0x89BC611A2770c28e67332e8f7A37c0c546e380B7',
    poolSafe: '0x50cF6e722aaD352453E519f0F9565634C2b48e2b',
    seniorTrancheVault: '0x44eb8b1ff0192aa1951B08F15964Ae62615BFaab',
    juniorTrancheVault: '0x449Edd4d106B8d36C662df74E30913352B7C8E3E',
    epochManager: '0xbc5d17AfF4F5c5B1815E3f8ECD47794CA7db98c4',
    poolAbi: POOL_ABI,
    poolSafeAbi: POOL_SAFE_ABI,
    poolConfigAbi: POOL_CONFIG_ABI,
    trancheVaultAbi: TRANCHE_VAULT_ABI,
    firstLossCoverAbi: FIRST_LOSS_COVER_ABI,
    epochManagerAbi: EPOCH_MANAGER_ABI,
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
