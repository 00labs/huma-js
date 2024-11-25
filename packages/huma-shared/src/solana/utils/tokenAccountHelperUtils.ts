import {
  getAssociatedTokenAddressSync,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token'
import { PublicKey } from '@solana/web3.js'

import { SolanaPoolInfo } from '../pool'

export const getTokenAccounts = (
  poolInfo: SolanaPoolInfo,
  account: PublicKey,
): {
  underlyingTokenATA: PublicKey
  seniorTrancheATA: PublicKey
  juniorTrancheATA: PublicKey
  poolSeniorTrancheATA: PublicKey
  poolJuniorTrancheATA: PublicKey
} => {
  const underlyingTokenATA = getAssociatedTokenAddressSync(
    new PublicKey(poolInfo.underlyingMint.address),
    account,
    true, // allowOwnerOffCurve
    TOKEN_PROGRAM_ID,
  )
  const juniorTrancheATA = getAssociatedTokenAddressSync(
    new PublicKey(poolInfo.juniorTrancheMint),
    account,
    true,
    TOKEN_2022_PROGRAM_ID,
  )
  const seniorTrancheATA = getAssociatedTokenAddressSync(
    new PublicKey(poolInfo.seniorTrancheMint),
    account,
    true,
    TOKEN_2022_PROGRAM_ID,
  )
  const poolJuniorTrancheATA = getAssociatedTokenAddressSync(
    new PublicKey(poolInfo.juniorTrancheMint),
    new PublicKey(poolInfo.poolAuthority),
    true,
    TOKEN_2022_PROGRAM_ID,
  )
  const poolSeniorTrancheATA = getAssociatedTokenAddressSync(
    new PublicKey(poolInfo.seniorTrancheMint),
    new PublicKey(poolInfo.poolAuthority),
    true,
    TOKEN_2022_PROGRAM_ID,
  )

  return {
    underlyingTokenATA,
    seniorTrancheATA,
    juniorTrancheATA,
    poolJuniorTrancheATA,
    poolSeniorTrancheATA,
  }
}
