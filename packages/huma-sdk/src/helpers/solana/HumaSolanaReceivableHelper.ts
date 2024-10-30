import { BN } from '@coral-xyz/anchor'
import { getHumaProgram, getSolanaPoolInfo } from '@huma-finance/shared'
import { Keypair, PublicKey, Transaction } from '@solana/web3.js'
import lodash from 'lodash'
import {
  getReceivableReferenceAccount,
  getReceivableReferenceData,
} from '../../utils/solana/getReceivableReferenceAccount'
import { HumaSolanaContext } from './HumaSolanaContext'
import { MPL_CORE_PROGRAM_ID } from './HumaSolanaProgramHelper'

export type ReceivableState =
  | 'deleted'
  | 'minted'
  | 'approved'
  | 'partiallyPaid'
  | 'paid'
  | 'rejected'
  | 'delayed'
  | 'defaulted'

type ReceivableInfo = {
  bump: number
  currencyCode: string
  receivableAmount: BN
  amountPaid: BN
  creationDate: BN
  maturityDate: BN
  creator: PublicKey
  state: ReceivableState
}

export class HumaSolanaReceivableHelper {
  #solanaContext: HumaSolanaContext

  constructor({ solanaContext }: { solanaContext: HumaSolanaContext }) {
    if (!solanaContext) {
      throw new Error('All parameters are required')
    }

    this.#solanaContext = solanaContext
  }

  async buildCreateReceivableTransaction(
    newAsset: Keypair,
    receivableArgs: {
      name: string
      uri: string
      currencyCode: string
      receivableAmount: BN
      maturityDate: BN
      referenceId: string
    },
  ): Promise<Transaction> {
    const { publicKey, connection, chainId, poolName } = this.#solanaContext
    const program = getHumaProgram(chainId, connection)
    const poolInfo = getSolanaPoolInfo(chainId, poolName)

    if (!poolInfo) {
      throw new Error('Could not find pool')
    }

    const tx: Transaction = new Transaction()
    const receivableReferencePDA = getReceivableReferenceAccount(
      chainId,
      publicKey,
      receivableArgs.referenceId,
    )

    const remainingAccounts = [
      {
        pubkey: receivableReferencePDA,
        isWritable: true,
        isSigner: false,
      },
    ]

    const programTx = await program.methods
      .createReceivable(receivableArgs)
      .accountsPartial({
        asset: newAsset.publicKey,
        owner: publicKey,
        mplCore: MPL_CORE_PROGRAM_ID,
        logWrapper: null,
      })
      .remainingAccounts(remainingAccounts)
      .transaction()

    tx.add(programTx)
    tx.feePayer = publicKey

    return tx
  }

  async buildDeclarePaymentTransaction(
    referenceId: string,
    paymentAmount: BN,
  ): Promise<Transaction> {
    const { publicKey, connection, chainId, poolName } = this.#solanaContext
    const program = getHumaProgram(chainId, connection)
    const poolInfo = getSolanaPoolInfo(chainId, poolName)

    if (!poolInfo) {
      throw new Error('Could not find pool')
    }

    const tx: Transaction = new Transaction()
    const receivableReferenceData = await getReceivableReferenceData(
      chainId,
      publicKey,
      connection,
      referenceId,
    )

    const programTx = await program.methods
      .declarePayment(paymentAmount)
      .accountsPartial({
        authority: publicKey,
        asset: receivableReferenceData.asset,
        mplCore: MPL_CORE_PROGRAM_ID,
        logWrapper: null,
      })
      .transaction()

    tx.add(programTx)

    return tx
  }

  async getReceivableInfo(
    referenceId: string,
    ownerOverride?: PublicKey,
  ): Promise<ReceivableInfo | null> {
    const { publicKey, connection, chainId, poolName } = this.#solanaContext
    const program = getHumaProgram(chainId, connection)
    const poolInfo = getSolanaPoolInfo(chainId, poolName)

    if (!poolInfo) {
      throw new Error('Could not find pool')
    }

    const receivableReferenceData = await getReceivableReferenceData(
      chainId,
      ownerOverride ?? publicKey,
      connection,
      referenceId,
    )
    const [receivableInfoPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('receivable_info'),
        receivableReferenceData.asset.toBuffer(),
      ],
      program.programId,
    )

    const data = await program.account.receivableInfo.fetchMultiple([
      receivableInfoPDA,
    ])
    const receivableInfo = data[0] as unknown as ReceivableInfo

    if (!receivableInfo) {
      return null
    }

    let state: ReceivableState
    if (lodash.isEqual(receivableInfo.state, { deleted: {} })) {
      state = 'deleted'
    } else if (lodash.isEqual(receivableInfo.state, { minted: {} })) {
      state = 'minted'
    } else if (lodash.isEqual(receivableInfo.state, { approved: {} })) {
      state = 'approved'
    } else if (lodash.isEqual(receivableInfo.state, { partiallyPaid: {} })) {
      state = 'partiallyPaid'
    } else if (lodash.isEqual(receivableInfo.state, { paid: {} })) {
      state = 'paid'
    } else if (lodash.isEqual(receivableInfo.state, { rejected: {} })) {
      state = 'rejected'
    } else if (lodash.isEqual(receivableInfo.state, { delayed: {} })) {
      state = 'delayed'
    } else {
      state = 'defaulted'
    }

    receivableInfo.state = state
    return receivableInfo
  }
}
