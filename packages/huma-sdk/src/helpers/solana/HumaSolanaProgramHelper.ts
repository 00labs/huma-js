import { BN } from '@coral-xyz/anchor'
import {
  getCreditAccounts,
  getHumaProgram,
  getSentinelAddress,
  getSolanaPoolInfo,
  getTokenAccounts,
  SolanaTokenUtils,
} from '@huma-finance/shared'
import {
  createApproveCheckedInstruction,
  createAssociatedTokenAccountInstruction,
  getAccount,
  TOKEN_PROGRAM_ID,
  TokenAccountNotFoundError,
} from '@solana/spl-token'
import { PublicKey, Transaction } from '@solana/web3.js'
import { buildOptimalTransaction } from '../../utils/solana/buildOptimalTransaction'
import { getReceivableReferenceData } from '../../utils/solana/getReceivableReferenceAccount'
import { HumaSolanaContext } from './HumaSolanaContext'

export const MPL_CORE_PROGRAM_ID =
  'CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d'

export class HumaSolanaProgramHelper {
  #solanaContext: HumaSolanaContext

  constructor({ solanaContext }: { solanaContext: HumaSolanaContext }) {
    if (!solanaContext) {
      throw new Error('All parameters are required')
    }

    this.#solanaContext = solanaContext
  }

  async getAvailableCreditForPool(): Promise<BN> {
    const { chainId, poolName } = this.#solanaContext
    const poolInfo = getSolanaPoolInfo(chainId, poolName)

    if (!poolInfo) {
      throw new Error('Could not find pool')
    }

    const accountInfo = await this.getAccountInfo()
    if (accountInfo === null) {
      throw new Error('Could not get account info for this pool.')
    }

    const tokenAccount = await getAccount(
      this.#solanaContext.connection,
      new PublicKey(poolInfo.poolUnderlyingTokenAccount),
      undefined,
      TOKEN_PROGRAM_ID,
    )

    const { creditConfig, creditState } = accountInfo
    const principalAmount = creditState.creditRecord.unbilledPrincipal
      .add(creditState.creditRecord.nextDue)
      .sub(creditState.creditRecord.yieldDue)
      .add(creditState.dueDetail.principalPastDue)
    const unusedCredit = creditConfig.creditLimit.sub(principalAmount)
    const poolTokenBalanceBN = new BN(tokenAccount.amount.toString())
    // Set available credit to the minimum of the pool balance or the credit available amount,
    // since both are upper bounds on the amount of credit that can be borrowed.
    // If either is negative, cap the available credit to 0.
    const creditAvailable = unusedCredit.lt(poolTokenBalanceBN)
      ? unusedCredit
      : poolTokenBalanceBN
    return creditAvailable.ltn(0) ? new BN(0) : creditAvailable
  }

  async buildSubmitReceivableTransaction(
    referenceId: string,
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
    const { creditConfigAccount, creditStateAccount } = getCreditAccounts(
      poolInfo,
      publicKey,
    )

    const programTx = await program.methods
      .submitReceivable()
      .accountsPartial({
        borrower: publicKey,
        asset: receivableReferenceData.asset,
        humaConfig: poolInfo.humaConfig,
        poolConfig: poolInfo.poolConfig,
        poolState: poolInfo.poolState,
        creditConfig: creditConfigAccount,
        creditState: creditStateAccount,
        mplCore: MPL_CORE_PROGRAM_ID,
        logWrapper: null,
      })
      .transaction()
    tx.add(programTx)

    await buildOptimalTransaction(
      tx,
      [
        publicKey,
        receivableReferenceData.asset,
        new PublicKey(poolInfo.humaConfig),
        new PublicKey(poolInfo.poolConfig),
        new PublicKey(poolInfo.poolState),
        creditConfigAccount,
        creditStateAccount,
        new PublicKey(MPL_CORE_PROGRAM_ID),
      ],
      this.#solanaContext,
    )

    return tx
  }

  async buildDrawdownTransaction(amount: BN): Promise<Transaction> {
    const { publicKey, connection, chainId, poolName } = this.#solanaContext
    const program = getHumaProgram(chainId, connection)
    const poolInfo = getSolanaPoolInfo(chainId, poolName)

    if (!poolInfo) {
      throw new Error('Could not find pool')
    }

    const tx: Transaction = new Transaction()
    const { creditConfigAccount, creditStateAccount } = getCreditAccounts(
      poolInfo,
      publicKey,
    )
    const { underlyingTokenATA: borrowerUnderlyingTokenAccountAddress } =
      getTokenAccounts(poolInfo, publicKey)
    const sentinelAddress = getSentinelAddress(chainId)

    let addApproveInstruction: boolean = false
    try {
      const borrowerUnderlyingTokenAccountInfo = await getAccount(
        connection,
        borrowerUnderlyingTokenAccountAddress,
        undefined,
        TOKEN_PROGRAM_ID,
      )

      if (
        new BN(
          borrowerUnderlyingTokenAccountInfo.delegatedAmount.toString(),
        ).lt(amount.muln(2)) ||
        borrowerUnderlyingTokenAccountInfo.delegate?.toString() !==
          sentinelAddress
      ) {
        addApproveInstruction = true
      }
    } catch (error) {
      if (error instanceof TokenAccountNotFoundError) {
        const createAccountInstruction =
          createAssociatedTokenAccountInstruction(
            publicKey,
            borrowerUnderlyingTokenAccountAddress,
            publicKey,
            new PublicKey(poolInfo.underlyingMint.address),
            TOKEN_PROGRAM_ID,
          )
        tx.add(createAccountInstruction)
        addApproveInstruction = true
      }
    }

    if (addApproveInstruction) {
      const approveInstruction = createApproveCheckedInstruction(
        borrowerUnderlyingTokenAccountAddress,
        new PublicKey(poolInfo.underlyingMint.address),
        new PublicKey(sentinelAddress), // delegate
        publicKey, // owner of the wallet
        BigInt(amount.muln(2).toString()), // amount
        poolInfo.underlyingMint.decimals,
        undefined, // multiSigners
        TOKEN_PROGRAM_ID,
      )
      tx.add(approveInstruction)
    }

    const programTx = await program.methods
      .drawdown(amount)
      .accountsPartial({
        borrower: publicKey,
        humaConfig: poolInfo.humaConfig,
        poolConfig: poolInfo.poolConfig,
        poolState: poolInfo.poolState,
        creditConfig: creditConfigAccount,
        creditState: creditStateAccount,
        poolAuthority: poolInfo.poolAuthority,
        underlyingMint: poolInfo.underlyingMint.address,
        poolUnderlyingToken: poolInfo.poolUnderlyingTokenAccount,
        borrowerUnderlyingToken: borrowerUnderlyingTokenAccountAddress,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .transaction()
    tx.add(programTx)

    await buildOptimalTransaction(
      tx,
      [
        publicKey,
        new PublicKey(poolInfo.humaConfig),
        new PublicKey(poolInfo.poolConfig),
        new PublicKey(poolInfo.poolState),
        creditConfigAccount,
        creditStateAccount,
        new PublicKey(poolInfo.poolAuthority),
        new PublicKey(poolInfo.underlyingMint.address),
        new PublicKey(poolInfo.poolUnderlyingTokenAccount),
        borrowerUnderlyingTokenAccountAddress,
        TOKEN_PROGRAM_ID,
      ],
      this.#solanaContext,
    )

    return tx
  }

  async buildPaymentTransaction(
    amount: BN,
    principalOnly: boolean = false,
  ): Promise<Transaction> {
    const { publicKey, chainId, poolName } = this.#solanaContext
    const program = getHumaProgram(chainId, this.#solanaContext.connection)
    const poolInfo = getSolanaPoolInfo(chainId, poolName)

    if (!poolInfo) {
      throw new Error('Could not find pool')
    }

    const { creditConfigAccount, creditStateAccount } = getCreditAccounts(
      poolInfo,
      publicKey,
    )
    const { underlyingTokenATA: borrowerUnderlyingTokenAccount } =
      getTokenAccounts(poolInfo, publicKey)

    const accounts = {
      humaConfig: poolInfo.humaConfig,
      poolConfig: poolInfo.poolConfig,
      poolState: poolInfo.poolState,
      creditConfig: creditConfigAccount,
      creditState: creditStateAccount,
      poolAuthority: poolInfo.poolAuthority,
      underlyingMint: poolInfo.underlyingMint.address,
      poolUnderlyingToken: poolInfo.poolUnderlyingTokenAccount,
      borrowerUnderlyingToken: borrowerUnderlyingTokenAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
    }

    let tx: Transaction
    if (principalOnly) {
      tx = await program.methods
        .makePrincipalPayment(amount)
        .accountsPartial({ ...accounts, borrower: publicKey })
        .transaction()
    } else {
      tx = await program.methods
        .makePayment(amount)
        .accountsPartial({ ...accounts, signer: publicKey })
        .transaction()
    }

    await buildOptimalTransaction(
      tx,
      [
        publicKey,
        new PublicKey(poolInfo.humaConfig),
        new PublicKey(poolInfo.poolConfig),
        new PublicKey(poolInfo.poolState),
        creditConfigAccount,
        creditStateAccount,
        new PublicKey(poolInfo.poolAuthority),
        new PublicKey(poolInfo.underlyingMint.address),
        new PublicKey(poolInfo.poolUnderlyingTokenAccount),
        borrowerUnderlyingTokenAccount,
        TOKEN_PROGRAM_ID,
      ],
      this.#solanaContext,
    )

    return tx
  }

  async buildApproveAllowanceTransaction(): Promise<Transaction> {
    const { publicKey, chainId, poolName } = this.#solanaContext
    const poolInfo = getSolanaPoolInfo(chainId, poolName)

    if (!poolInfo) {
      throw new Error('Could not find pool')
    }

    const { underlyingTokenATA: borrowerUnderlyingTokenAccount } =
      getTokenAccounts(poolInfo, publicKey)

    const tx = new Transaction().add(
      createApproveCheckedInstruction(
        borrowerUnderlyingTokenAccount,
        new PublicKey(poolInfo.underlyingMint.address),
        new PublicKey(getSentinelAddress(chainId)),
        publicKey,
        BigInt(
          SolanaTokenUtils.parseUnits(
            '100000000000',
            poolInfo.underlyingMint.decimals,
          ).toString(),
        ),
        poolInfo.underlyingMint.decimals,
        undefined,
        TOKEN_PROGRAM_ID,
      ),
    )

    await buildOptimalTransaction(
      tx,
      [
        publicKey,
        borrowerUnderlyingTokenAccount,
        new PublicKey(poolInfo.underlyingMint.address),
        new PublicKey(getSentinelAddress(chainId)),
        TOKEN_PROGRAM_ID,
      ],
      this.#solanaContext,
    )

    return tx
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getAccountInfo(): Promise<{
    creditConfig: {
      creditLimit: BN
      committedAmount: BN
      numPeriods: number
      yieldBps: number
    }
    creditState: {
      creditRecord: {
        status: unknown
        nextDue: BN
        yieldDue: BN
        nextDueDate: BN
        totalPastDue: BN
        missedPeriods: number
        remainingPeriods: number
        unbilledPrincipal: BN
      }
      dueDetail: {
        paid: BN
        accrued: BN
        lateFee: BN
        committed: BN
        yieldPastDue: BN
        principalPastDue: BN
        lateFeeUpdatedDate: BN
      }
      receivableAvailableCredits: BN
    }
  } | null> {
    const { publicKey, chainId, poolName } = this.#solanaContext
    const program = getHumaProgram(chainId, this.#solanaContext.connection)
    const poolInfo = getSolanaPoolInfo(chainId, poolName)

    if (!poolInfo) {
      throw new Error('Could not find pool')
    }

    const { creditConfigAccount, creditStateAccount } = getCreditAccounts(
      poolInfo,
      publicKey,
    )

    const ccData = await program.account.creditConfig.fetchMultiple([
      creditConfigAccount,
    ])
    const ccInfo = ccData[0]

    const csData = await program.account.creditState.fetchMultiple([
      creditStateAccount,
    ])
    const csInfo = csData[0]

    if (!ccInfo || !csInfo) {
      return null
    }

    return {
      creditConfig: ccInfo,
      creditState: csInfo,
    }
  }
}
