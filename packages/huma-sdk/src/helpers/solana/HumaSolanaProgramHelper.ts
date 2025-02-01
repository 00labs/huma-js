import { BN, utils } from '@coral-xyz/anchor'
import {
  calculateAvailablePoolBalance,
  convertToAssets,
  getCreditAccounts,
  getHumaProgram,
  getSentinelAddress,
  getSolanaPoolInfo,
  getTokenAccounts,
  SolanaTokenUtils,
  TrancheType,
} from '@huma-finance/shared'
import {
  createApproveCheckedInstruction,
  createAssociatedTokenAccountInstruction,
  getAccount,
  getAssociatedTokenAddress,
  getMint,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  TokenAccountNotFoundError,
} from '@solana/spl-token'
import { PublicKey, Transaction } from '@solana/web3.js'
import { getReceivableReferenceData } from '../../utils/solana/getReceivableReferenceAccount'
import { HumaSolanaContext } from './HumaSolanaContext'

export const MPL_CORE_PROGRAM_ID =
  'CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d'

const DEFAULT_DECIMALS_FACTOR = BigInt('1000000000000000000')

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
    const poolStateAccount = await this.getPoolState()

    const { creditConfig, creditState } = accountInfo
    const principalAmount = creditState.creditRecord.unbilledPrincipal
      .add(creditState.creditRecord.nextDue)
      .sub(creditState.creditRecord.yieldDue)
      .add(creditState.dueDetail.principalPastDue)
    const unusedCredit = creditConfig.creditLimit.sub(principalAmount)
    const availablePoolBalanceBN = calculateAvailablePoolBalance(
      tokenAccount,
      poolStateAccount,
    )
    // Set available credit to the minimum of the pool balance or the credit available amount,
    // since both are upper bounds on the amount of credit that can be borrowed.
    // If either is negative, cap the available credit to 0.
    const creditAvailable = unusedCredit.lt(availablePoolBalanceBN)
      ? unusedCredit
      : availablePoolBalanceBN
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

    return tx
  }

  async getWithdrawableYieldOfTranche(
    trancheMint: PublicKey,
    trancheType: TrancheType,
    trancheAssets: BN[],
  ): Promise<bigint> {
    const { connection, chainId, poolName, publicKey } = this.#solanaContext
    const program = getHumaProgram(chainId, connection)
    const poolInfo = getSolanaPoolInfo(chainId, poolName)

    if (!poolInfo) {
      throw new Error(`Could not find pool ${poolName}`)
    }

    const mintAccount = await getMint(
      connection,
      trancheMint,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    )
    const trancheATA = await getAssociatedTokenAddress(
      trancheMint,
      publicKey,
      true, // allowOwnerOffCurve
      TOKEN_2022_PROGRAM_ID,
    )
    let trancheTokenAccount
    try {
      trancheTokenAccount = await getAccount(
        connection,
        trancheATA,
        undefined, // commitment
        TOKEN_2022_PROGRAM_ID,
      )
    } catch (error) {
      console.log(
        `Couldn't find token account for ${trancheATA.toString()} tranche ${trancheType}`,
      )
      return BigInt(0)
    }

    const [lenderStatePDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('lender_state'),
        trancheMint.toBuffer(),
        publicKey.toBuffer(),
      ],
      program.programId,
    )
    const lenderState = await program.account.lenderState.fetchNullable(
      lenderStatePDA,
    )

    if (!lenderState) {
      return BigInt(0)
    }

    // Scale numbers using `DEFAULT_DECIMALS_FACTOR` to reduce precision loss caused by
    // integer division.
    const priceWithDecimals = convertToAssets(
      BigInt(trancheAssets[trancheType === 'junior' ? 0 : 1].toString()),
      mintAccount.supply,
      DEFAULT_DECIMALS_FACTOR,
    )
    const assetsWithDecimals =
      priceWithDecimals * BigInt(trancheTokenAccount.amount.toString())
    const principalWithDecimals =
      BigInt(lenderState.depositRecord.principal.toString()) *
      DEFAULT_DECIMALS_FACTOR
    const yieldsWithDecimals = assetsWithDecimals - principalWithDecimals
    return yieldsWithDecimals / DEFAULT_DECIMALS_FACTOR
  }

  // Returns the withdrawable yields for the lender for the junior and senior tranche, if applicable
  async getWithdrawableYields(): Promise<[bigint, bigint]> {
    const { connection, chainId, poolName } = this.#solanaContext
    const program = getHumaProgram(chainId, connection)
    const poolInfo = getSolanaPoolInfo(chainId, poolName)

    if (!poolInfo) {
      throw new Error('Could not find pool')
    }

    const poolStateAccountResult = await program.account.poolState.fetch(
      new PublicKey(poolInfo.poolState),
    )

    const juniorYield = await this.getWithdrawableYieldOfTranche(
      new PublicKey(poolInfo.juniorTrancheMint),
      'junior',
      poolStateAccountResult.trancheAssets.assets,
    )

    if (!poolInfo.seniorTrancheMint) {
      return [juniorYield, BigInt(0)]
    }

    const seniorYield = await this.getWithdrawableYieldOfTranche(
      new PublicKey(poolInfo.seniorTrancheMint),
      'senior',
      poolStateAccountResult.trancheAssets.assets,
    )

    return [juniorYield, seniorYield]
  }

  async buildWithdrawYieldsTransaction(
    trancheType: TrancheType,
  ): Promise<Transaction> {
    const { publicKey, connection, chainId, poolName } = this.#solanaContext
    const program = getHumaProgram(chainId, connection)
    const poolInfo = getSolanaPoolInfo(chainId, poolName)

    if (!poolInfo) {
      throw new Error('Could not find pool')
    }

    const tx: Transaction = new Transaction()

    const { underlyingTokenATA, seniorTrancheATA, juniorTrancheATA } =
      getTokenAccounts(poolInfo, publicKey)
    const trancheMint =
      trancheType === 'junior'
        ? poolInfo.juniorTrancheMint
        : poolInfo.seniorTrancheMint
    const lenderTrancheToken =
      trancheType === 'junior' ? juniorTrancheATA : seniorTrancheATA
    const [yieldDistributingLenderAccount] = PublicKey.findProgramAddressSync(
      [
        utils.bytes.utf8.encode('yield_distributing_lender'),
        new PublicKey(trancheMint).toBuffer(),
        publicKey.toBuffer(),
      ],
      program.programId,
    )
    const programTx = await program.methods
      .withdrawYields()
      .accountsPartial({
        lender: publicKey,
        humaConfig: poolInfo.humaConfig,
        poolConfig: poolInfo.poolConfig,
        yieldDistributingLender: yieldDistributingLenderAccount,
        underlyingMint: poolInfo.underlyingMint.address,
        poolUnderlyingToken: poolInfo.poolUnderlyingTokenAccount,
        lenderUnderlyingToken: underlyingTokenATA,
        trancheMint,
        lenderTrancheToken,
        underlyingTokenProgram: TOKEN_PROGRAM_ID,
        trancheTokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .transaction()
    tx.add(programTx)

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

    return tx
  }

  async getPoolState(): Promise<{
    accruedIncomes: { protocolIncome: BN; poolOwnerIncome: BN; eaIncome: BN }
    incomeWithdrawn: {
      eaIncomeWithdrawn: BN
      poolOwnerIncomeWithdrawn: BN
      protocolIncomeWithdrawn: BN
    }
    disbursementReserve: BN
    trancheAssets: BN[]
  }> {
    const { chainId, poolName } = this.#solanaContext
    const program = getHumaProgram(chainId, this.#solanaContext.connection)
    const poolInfo = getSolanaPoolInfo(chainId, poolName)

    if (!poolInfo) {
      throw new Error('Could not find pool')
    }

    const poolStateAccountResult = await program.account.poolState.fetch(
      new PublicKey(poolInfo.poolState),
    )

    return {
      accruedIncomes: poolStateAccountResult.accruedIncomes,
      incomeWithdrawn: poolStateAccountResult.incomeWithdrawn,
      disbursementReserve: poolStateAccountResult.disbursementReserve,
      trancheAssets: poolStateAccountResult.trancheAssets.assets,
    }
  }

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
