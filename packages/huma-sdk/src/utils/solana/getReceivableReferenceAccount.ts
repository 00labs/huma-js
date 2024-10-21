import { utils } from '@coral-xyz/anchor'
import { getPoolProgramAddress, SolanaChainEnum } from '@huma-finance/shared'
import { Connection, PublicKey } from '@solana/web3.js'
import * as crypto from 'crypto'
import * as borsh from '@coral-xyz/borsh'

export function getReceivableReferenceAccount(
  chainId: SolanaChainEnum,
  publicKey: PublicKey,
  referenceId: string,
): PublicKey {
  const referenceIdHash = crypto
    .createHash('sha256')
    .update(referenceId)
    .digest('hex')
  const referenceIdSeed = Buffer.from(referenceIdHash, 'hex')
  return PublicKey.findProgramAddressSync(
    [
      utils.bytes.utf8.encode('receivable_reference'),
      publicKey.toBuffer(),
      referenceIdSeed,
    ],
    new PublicKey(getPoolProgramAddress(chainId)),
  )[0]
}

export async function getReceivableReferenceData(
  chainId: SolanaChainEnum,
  publicKey: PublicKey,
  connection: Connection,
  referenceId: string,
): Promise<{ reference_id: string; asset: PublicKey; bump: number }> {
  const receivableReferencePDA = getReceivableReferenceAccount(
    chainId,
    publicKey,
    referenceId,
  )

  const receivableReferenceData = await connection.getAccountInfo(
    receivableReferencePDA,
  )
  if (!receivableReferenceData) {
    throw new Error(
      `Receivable reference account for address ${receivableReferencePDA} not found`,
    )
  }

  const dataWithoutDiscriminator = receivableReferenceData.data.subarray(8)
  const borshAccountSchema = borsh.struct([
    borsh.str('reference_id'),
    borsh.publicKey('asset'),
    borsh.u8('bump'),
  ])

  const res = borshAccountSchema.decode(dataWithoutDiscriminator)
  return res
}
