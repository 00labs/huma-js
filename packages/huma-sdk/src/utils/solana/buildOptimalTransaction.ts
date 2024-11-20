import {
  ComputeBudgetProgram,
  Connection,
  PublicKey,
  RecentPrioritizationFees,
  Transaction,
} from '@solana/web3.js'
import { HumaSolanaContext } from '../../helpers'

export function extractWritableAccounts(tx: Transaction): PublicKey[] {
  const writableAccounts = new Set<PublicKey>()

  tx.instructions.forEach((ix) => {
    ix.keys.forEach((key) => {
      if (key.isWritable) {
        writableAccounts.add(key.pubkey)
      }
    })
  })

  return Array.from(writableAccounts)
}

async function buildOptimalTransactionImpl(
  tx: Transaction,
  txAccounts: PublicKey[],
  connection: Connection,
): Promise<Transaction> {
  const [recentPrioritizationFees, recentBlockhash] = await Promise.all([
    connection.getRecentPrioritizationFees({
      lockedWritableAccounts: txAccounts,
    }),
    connection.getLatestBlockhash('confirmed'),
  ])

  let averagePrioritizationFee = recentPrioritizationFees.reduce(
    (acc: number, fee: RecentPrioritizationFees) => acc + fee.prioritizationFee,
    0,
  )
  averagePrioritizationFee = Math.ceil(
    (averagePrioritizationFee / recentPrioritizationFees.length) * 1.5,
  )

  tx.instructions.unshift(
    ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: averagePrioritizationFee,
    }),
  )

  tx.recentBlockhash = recentBlockhash.blockhash
  tx.lastValidBlockHeight = recentBlockhash.lastValidBlockHeight
  return tx
}

export async function buildOptimalTransaction(
  tx: Transaction,
  txAccounts: PublicKey[],
  context: HumaSolanaContext,
): Promise<Transaction> {
  return buildOptimalTransactionImpl(tx, txAccounts, context.connection)
}

export async function buildOptimalTransactionFromConnection(
  tx: Transaction,
  txAccounts: PublicKey[],
  connection: Connection,
): Promise<Transaction> {
  return buildOptimalTransactionImpl(tx, txAccounts, connection)
}
