import { SolanaChainEnum } from '@huma-finance/shared'
import {
  ComputeBudgetProgram,
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
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
            },
          },
        ],
      }),
    })
    const data = await response.json()
    return data.result
  } catch (err) {
    console.warn(err)
    return null
  }
}

/**
 * Check if a given instruction is a SetComputeUnitLimit instruction
 * See https://github.com/solana-program/compute-budget/blob/main/clients/js/src/generated/programs/computeBudget.ts#L29
 */
function isSetComputeLimitInstruction(ix: TransactionInstruction): boolean {
  return (
    ix.programId.equals(ComputeBudgetProgram.programId) && ix.data[0] === 2 // opcode for setComputeUnitLimit is 2
  )
}

async function buildOptimalTransactionImpl(
  tx: Transaction,
  txAccounts: PublicKey[],
  connection: Connection,
  chainEnum: SolanaChainEnum,
  signer: PublicKey,
  heliusPriority: HeliusPriorityLevel = 'Medium',
  heliusApiKey?: string | null,
): Promise<{
  tx: Transaction
  unitsConsumed: number | undefined
  fee: number | undefined
}> {
  let unitsConsumed: number | undefined
  const computeLimitIndex = tx.instructions.findIndex(
    isSetComputeLimitInstruction,
  )

  // Calculate compute unit limit if it doesn't exist
  if (computeLimitIndex === -1) {
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
    unitsConsumed = rpcResponse.value.unitsConsumed
    if (unitsConsumed) {
      tx.instructions.unshift(
        ComputeBudgetProgram.setComputeUnitLimit({
          units: unitsConsumed * 1.2,
        }),
      )
    }
  }

  // Calculate compute unit priority fee
  const heliusPriorityFeeEstimateRes = await getPriorityFeeEstimate(
    heliusPriority,
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

  return { tx, unitsConsumed, fee: chosenFee }
}

export async function buildOptimalTransaction(
  tx: Transaction,
  txAccounts: PublicKey[],
  context: HumaSolanaContext,
  heliusPriorityLevel?: HeliusPriorityLevel,
): Promise<{
  tx: Transaction
  unitsConsumed: number | undefined
  fee: number | undefined
}> {
  return buildOptimalTransactionImpl(
    tx,
    txAccounts,
    context.connection,
    context.chainId,
    context.publicKey,
    heliusPriorityLevel,
    context.heliusApiKey,
  )
}

export async function buildOptimalTransactionFromConnection(
  tx: Transaction,
  txAccounts: PublicKey[],
  connection: Connection,
  chainId: SolanaChainEnum,
  signer: PublicKey,
  heliusPriorityLevel?: HeliusPriorityLevel,
  heliusApiKey?: string | null,
): Promise<{
  tx: Transaction
  unitsConsumed: number | undefined
  fee: number | undefined
}> {
  return buildOptimalTransactionImpl(
    tx,
    txAccounts,
    connection,
    chainId,
    signer,
    heliusPriorityLevel,
    heliusApiKey,
  )
}
