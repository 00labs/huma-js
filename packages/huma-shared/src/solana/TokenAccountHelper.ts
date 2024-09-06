import {
  getAssociatedTokenAddressSync,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token'
import { PublicKey } from '@solana/web3.js'
import { SolanaPoolInfo } from '../v2'

export const getTokenAccounts = (
  poolInfo: SolanaPoolInfo,
  account: PublicKey,
): [PublicKey, PublicKey, PublicKey] => {
  const underlyingTokenATA = getAssociatedTokenAddressSync(
    new PublicKey(poolInfo.underlyingMint.address),
    account,
    false, // allowOwnerOffCurve
    TOKEN_2022_PROGRAM_ID,
  )
  const juniorTrancheATA = getAssociatedTokenAddressSync(
    new PublicKey(poolInfo.juniorTrancheMint),
    account,
    false,
    TOKEN_2022_PROGRAM_ID,
  )
  const seniorTrancheATA = getAssociatedTokenAddressSync(
    new PublicKey(poolInfo.juniorTrancheMint),
    account,
    false,
    TOKEN_2022_PROGRAM_ID,
  )

  return [underlyingTokenATA, juniorTrancheATA, seniorTrancheATA]
}
