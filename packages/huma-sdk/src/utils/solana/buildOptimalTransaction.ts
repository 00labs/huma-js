import {
  ComputeBudgetProgram,
  Connection,
  PublicKey,
  Transaction,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js'
import { SolanaChainEnum } from '@huma-finance/shared'
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

export type HeliusPriorityLevel =
  | 'Min'
  | 'Low'
  | 'Medium'
  | 'High'
  | 'VeryHigh'
  | 'UnsafeMax'

async function getPriorityFeeEstimate(
  priorityLevel: HeliusPriorityLevel,
  tx: Transaction,
  txAccounts: PublicKey[],
  chainEnum: SolanaChainEnum,
  heliusApiKey?: string | null,
) {
  if (!heliusApiKey) {
    return null
  }

  const heliusURL =
    chainEnum === SolanaChainEnum.SolanaMainnet
      ? `https://mainnet.helius-rpc.com/?api-key=${heliusApiKey}`
      : `https://devnet.helius-rpc.com/?api-key=${heliusApiKey}`
  try {
    const response = await fetch(heliusURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: '1',
        method: 'getPriorityFeeEstimate',
        params: [
          {
            accountKeys: txAccounts,
            options: {
              priorityLevel,
              evaluateEmptySlotAsZero: true,
              recommended: true,
            },
          },
        ],
      }),
    })
    const data = await response.json()
    console.log(data)
    return data.result
  } catch (err) {
    console.warn(err)
    return null
  }
}

async function buildOptimalTransactionImpl(
  tx: Transaction,
  txAccounts: PublicKey[],
  connection: Connection,
  chainEnum: SolanaChainEnum,
  signer: PublicKey,
  heliusApiKey?: string | null,
): Promise<Transaction> {
  // Calculate compute unit limit
  const testInstructions = [
    ComputeBudgetProgram.setComputeUnitLimit({ units: 1_400_000 }),
    ...tx.instructions,
  ]
  const testTransaction = new VersionedTransaction(
    new TransactionMessage({
      instructions: testInstructions,
      payerKey: signer,
      recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
    }).compileToV0Message([]),
  )
  const rpcResponse = await connection.simulateTransaction(testTransaction, {
    replaceRecentBlockhash: true,
    sigVerify: false,
  })
  const { unitsConsumed } = rpcResponse.value
  if (unitsConsumed) {
    tx.instructions.unshift(
      ComputeBudgetProgram.setComputeUnitLimit({ units: unitsConsumed * 1.2 }),
    )
  }

  // Calculate compute unit priority fee
  const heliusPriorityFeeEstimateRes = await getPriorityFeeEstimate(
    'High',
    tx,
    txAccounts,
    chainEnum,
    heliusApiKey,
  )
  const heliusPriorityFeeEstimate =
    heliusPriorityFeeEstimateRes?.priorityFeeEstimate
  const chosenFee = heliusPriorityFeeEstimate ?? 500_000
  tx.instructions.unshift(
    ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: chosenFee,
    }),
  )

  return tx
}

export async function buildOptimalTransaction(
  tx: Transaction,
  txAccounts: PublicKey[],
  context: HumaSolanaContext,
): Promise<Transaction> {
  return buildOptimalTransactionImpl(
    tx,
    txAccounts,
    context.connection,
    context.chainId,
    context.publicKey,
    context.heliusApiKey,
  )
}

export async function buildOptimalTransactionFromConnection(
  tx: Transaction,
  txAccounts: PublicKey[],
  connection: Connection,
  chainId: SolanaChainEnum,
  signer: PublicKey,
  heliusApiKey?: string | null,
): Promise<Transaction> {
  return buildOptimalTransactionImpl(
    tx,
    txAccounts,
    connection,
    chainId,
    signer,
    heliusApiKey,
  )
}
