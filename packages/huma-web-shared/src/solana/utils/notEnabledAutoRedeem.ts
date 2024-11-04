import { Account } from '@solana/spl-token'
import { PublicKey } from '@solana/web3.js'

export const notEnabledAutoRedeem = (
  tokenAccount: Account | undefined,
  poolAuthorityPubkey: PublicKey,
  amount: bigint | undefined,
): boolean =>
  !!tokenAccount &&
  !!amount &&
  tokenAccount.amount > 0 &&
  (tokenAccount.delegate == null ||
    !poolAuthorityPubkey.equals(tokenAccount.delegate) ||
    tokenAccount.delegatedAmount < amount)
