import { ChainEnum } from '../../utils/chain'
import { POOL_NAME, POOL_TYPE } from '../../utils/pool'
import POOL_ABI from '../abis/Pool.json'
import POOL_SAFE_ABI from '../abis/PoolSafe.json'
import TRANCHE_VAULT_ABI from '../abis/TrancheVault.json'
import { PoolsInfoV2 } from '../utils'

export const MUMBAI_METADATA: PoolsInfoV2 = {
  HumaCreditLineV2: {
    chainId: ChainEnum.Mumbai,
    poolName: POOL_NAME.HumaCreditLineV2,
    poolType: POOL_TYPE.CreditLine,
    pool: '0x3E638f5A36C885c68f0F05143cbb617affA29e4e',
    poolAbi: POOL_ABI,
    poolSafeAbi: POOL_SAFE_ABI,
    seniorTrancheVault: '0x3DC3b427b75672f6738D036F68B3146DAA1CaFc1',
    juniorTrancheVault: '0xD76d80992B8698D6D8e3ef166c3879a1d8574a90',
    trancheVaultAbi: TRANCHE_VAULT_ABI,
    poolSafe: '0xd05e4bE51758b987b959924D7E8b4Cb728c386Fd',
    seniorAPY: '10-20%',
    juniorAPY: '10-20%',
    poolUnderlyingToken: {
      address: '0xee822415dcE6e3Ca8Ac43499FdA91744bd9Ad16A',
      symbol: 'USDC',
      decimals: 6,
      icon: 'USDC',
    },
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
