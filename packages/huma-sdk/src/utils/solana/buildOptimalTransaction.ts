import { ComputeBudgetProgram, PublicKey, Transaction } from '@solana/web3.js'
import { HumaSolanaContext } from 'helpers'

export async function buildOptimalTransaction(
  tx: Transaction,
  txAccounts: PublicKey[],
  context: HumaSolanaContext,
): Promise<Transaction> {
  const [recentPrioritizationFees, recentBlockhash] = await Promise.all([
    context.connection.getRecentPrioritizationFees({
      lockedWritableAccounts: txAccounts,
    }),
    context.connection.getLatestBlockhash(),
  ])

  let averagePrioritizationFee = recentPrioritizationFees.reduce(
    (acc, fee) => acc + fee.prioritizationFee,
    0,
  )
  averagePrioritizationFee = Math.ceil(
    averagePrioritizationFee / recentPrioritizationFees.length,
  )

  tx.instructions.unshift(
    ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: averagePrioritizationFee,
    }),
  )

  tx.recentBlockhash = recentBlockhash.blockhash
  return tx
}
