import { BN, Program } from '@coral-xyz/anchor'
import { PermissionlessVoter } from '@huma-finance/shared'
import { PublicKey } from '@solana/web3.js'

interface Deposit {
  amountDepositedNative: BN
}

export interface PermissionlessVoterType {
  deposits: Deposit[]
}

export const tryGetPermissionlessVoter = async (
  voterPk: PublicKey,
  program: Program<PermissionlessVoter>,
) => {
  try {
    const voter = await program.account.voter.fetch(voterPk)
    // The cast to any works around an anchor issue with interpreting enums
    return voter as unknown as PermissionlessVoterType
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return undefined
  }
}
