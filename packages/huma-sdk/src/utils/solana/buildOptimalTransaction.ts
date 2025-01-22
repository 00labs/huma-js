import {
  ComputeBudgetProgram,
  Connection,
  PublicKey,
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
  const recentBlockhash = await connection.getLatestBlockhash('confirmed')

  tx.instructions.unshift(
    ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: 5_000_000,
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
