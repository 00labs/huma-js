import {
  ComputeBudgetProgram,
  Connection,
  PublicKey,
  RecentPrioritizationFees,
  Transaction,
} from '@solana/web3.js'
import { getSimulationComputeUnits } from '@solana-developers/helpers'
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
  txAccounts: PublicKey[],
  chainEnum: SolanaChainEnum,
  heliusApiKey?: string | null,
) {
  console.log(heliusApiKey)
  if (!heliusApiKey) {
    return null
  }

  const heliusURL =
    chainEnum === SolanaChainEnum.SolanaMainnet
      ? `https://mainnet.helius-rpc.com/?api-key=${heliusApiKey}`
      : `https://devnet.helius-rpc.com/?api-key=${heliusApiKey}`
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
  return data.result
}

async function buildOptimalTransactionImpl(
  tx: Transaction,
  txAccounts: PublicKey[],
  connection: Connection,
  chainEnum: SolanaChainEnum,
  signer: PublicKey,
  heliusApiKey?: string | null,
): Promise<Transaction> {
  const [recentPrioritizationFees, units, recentBlockhash] = await Promise.all([
    connection.getRecentPrioritizationFees(),
    getSimulationComputeUnits(connection, tx.instructions, signer, []),
    connection.getLatestBlockhash('confirmed'),
  ])
  tx.recentBlockhash = recentBlockhash.blockhash
  tx.lastValidBlockHeight = recentBlockhash.lastValidBlockHeight

  const heliusPriorityFeeEstimateRes = await getPriorityFeeEstimate(
    'High',
    txAccounts,
    chainEnum,
    heliusApiKey,
  )
  const heliusPriorityFeeEstimate =
    heliusPriorityFeeEstimateRes?.priorityFeeEstimate
  let chosenFee
  if (heliusPriorityFeeEstimate) {
    chosenFee = heliusPriorityFeeEstimate
  } else {
    const recentFees = recentPrioritizationFees.map(
      (f: RecentPrioritizationFees) => f.prioritizationFee,
    )
    const medianFee = recentFees.sort((a, b) => a - b)[
      Math.floor(recentFees.length / 2)
    ]
    console.log(medianFee)
    chosenFee = medianFee === 0 ? 500_000 : medianFee // Set a baseline fee of 500_000
    console.log(chosenFee)
  }

  tx.instructions.unshift(
    ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: chosenFee,
    }),
  )

  if (units) {
    tx.instructions.unshift(
      ComputeBudgetProgram.setComputeUnitLimit({
        units: Math.ceil(units * 1.2),
      }),
    )
  }

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
): Promise<Transaction> {
  return buildOptimalTransactionImpl(
    tx,
    txAccounts,
    connection,
    chainId,
    signer,
  )
}
