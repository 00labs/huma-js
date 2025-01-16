/* eslint-disable no-plusplus */
import { AnchorProvider, BN, Program, Wallet } from '@coral-xyz/anchor'
import {
  getHumaProgram,
  getPoolProgramAddress,
  getSolanaPoolInfo,
  HumaSolanaJson,
  POOL_NAME,
  SOLANA_CHAIN_POOLS_INFO,
  SolanaChainEnum,
  SolanaPoolInfo,
  TrancheType,
} from '@huma-finance/shared'
import { Huma } from '@huma-finance/shared/src/solana/idl/huma'
import {
  Account,
  getAccount,
  getAssociatedTokenAddress,
  getMint,
  Mint,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  TokenAccountNotFoundError,
} from '@solana/spl-token'
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import lodash from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForceRefresh } from '../../hooks/useForceRefresh'

export type PoolStateAccount = {
  accruedIncomes: { protocolIncome: BN; poolOwnerIncome: BN; eaIncome: BN }
  incomeWithdrawn: {
    eaIncomeWithdrawn: BN
    poolOwnerIncomeWithdrawn: BN
    protocolIncomeWithdrawn: BN
  }
  disbursementReserve: BN
  trancheAssets: BN[]
}

export const usePoolStateAccount = (
  chainId: SolanaChainEnum,
  poolName: POOL_NAME,
): {
  poolStateAccount: PoolStateAccount | undefined
  loading: boolean
  refresh: () => void
} => {
  const wallet = useAnchorWallet()
  const { connection } = useConnection()
  const [loading, setLoading] = useState<boolean>(true)
  const poolInfo = useMemo(
    () => getSolanaPoolInfo(chainId, poolName),
    [chainId, poolName],
  )
  const [poolStateAccount, setPoolStateAccount] = useState<PoolStateAccount>()
  const [refreshCount, refresh] = useForceRefresh()

  useEffect(() => {
    async function fetchPoolStateAccount() {
      setLoading(true)
      if (!poolInfo || !connection || !wallet) {
        setLoading(false)
        return
      }
      const program = getHumaProgram(chainId, connection, wallet as Wallet)
      const poolStateAccountResult = await program.account.poolState.fetch(
        new PublicKey(poolInfo.poolState),
      )

      setPoolStateAccount({
        accruedIncomes: poolStateAccountResult.accruedIncomes,
        incomeWithdrawn: poolStateAccountResult.incomeWithdrawn,
        disbursementReserve: poolStateAccountResult.disbursementReserve,
        trancheAssets: poolStateAccountResult.trancheAssets.assets,
      })
      setLoading(false)
    }

    fetchPoolStateAccount()
  }, [chainId, connection, poolInfo, wallet, refreshCount])

  return {
    poolStateAccount,
    loading,
    refresh,
  }
}

export const useTrancheMintAccounts = (
  poolInfo: SolanaPoolInfo,
  tranche: TrancheType,
): {
  mintAccount: Mint | undefined
  loading: boolean
} => {
  const { publicKey } = useWallet()
  const wallet = useAnchorWallet()
  const { connection } = useConnection()
  const [loading, setLoading] = useState<boolean>(true)
  const [mintAccount, setMintAccount] = useState<Mint>()

  useEffect(() => {
    async function fetchTokenAccount() {
      setLoading(true)
      if (!publicKey || !connection || !wallet) {
        setLoading(false)
        return
      }

      try {
        const mintAccountResult = await getMint(
          connection,
          new PublicKey(
            tranche === 'senior'
              ? poolInfo.seniorTrancheMint
              : poolInfo.juniorTrancheMint,
          ),
          undefined,
          TOKEN_2022_PROGRAM_ID,
        )
        setMintAccount(mintAccountResult)
      } catch (error) {
        setMintAccount(undefined)
        console.warn(error)
      }

      setLoading(false)
    }

    fetchTokenAccount()
  }, [
    publicKey,
    connection,
    wallet,
    poolInfo.underlyingMint.address,
    poolInfo.seniorTrancheMint,
    poolInfo.juniorTrancheMint,
    tranche,
  ])

  return { mintAccount, loading }
}

export const useTrancheTokenAccounts = (
  poolInfo: SolanaPoolInfo,
): {
  seniorTokenAccount: Account | undefined
  juniorTokenAccount: Account | undefined
  loading: boolean
  refresh: () => void
} => {
  const { publicKey } = useWallet()
  const wallet = useAnchorWallet()
  const { connection } = useConnection()
  const [loading, setLoading] = useState<boolean>(true)
  const [seniorTokenAccount, setSeniorTokenAccount] = useState<Account>()
  const [juniorTokenAccount, setJuniorTokenAccount] = useState<Account>()
  const [refreshCount, refresh] = useForceRefresh()

  useEffect(() => {
    async function fetchTokenAccount() {
      setLoading(true)
      if (!publicKey || !connection || !wallet) {
        setLoading(false)
        return
      }

      const [seniorATA, juniorATA] = await Promise.all([
        getAssociatedTokenAddress(
          new PublicKey(poolInfo.seniorTrancheMint),
          publicKey,
          true, // allowOwnerOffCurve
          TOKEN_2022_PROGRAM_ID,
        ),
        getAssociatedTokenAddress(
          new PublicKey(poolInfo.juniorTrancheMint),
          publicKey,
          true, // allowOwnerOffCurve
          TOKEN_2022_PROGRAM_ID,
        ),
      ])

      try {
        const seniorTokenAccount = await getAccount(
          connection,
          seniorATA,
          undefined,
          TOKEN_2022_PROGRAM_ID,
        )
        setSeniorTokenAccount(seniorTokenAccount)
      } catch (error) {
        if (error instanceof TokenAccountNotFoundError) {
          setSeniorTokenAccount(undefined)
        }

        console.warn(error)
      }

      try {
        const juniorTokenAccount = await getAccount(
          connection,
          juniorATA,
          undefined,
          TOKEN_2022_PROGRAM_ID,
        )
        setJuniorTokenAccount(juniorTokenAccount)
      } catch (error) {
        if (error instanceof TokenAccountNotFoundError) {
          setJuniorTokenAccount(undefined)
        }

        console.warn(error)
      }

      setLoading(false)
    }

    fetchTokenAccount()
  }, [
    publicKey,
    connection,
    wallet,
    poolInfo.underlyingMint.address,
    poolInfo.seniorTrancheMint,
    refreshCount,
    poolInfo.juniorTrancheMint,
  ])

  return { seniorTokenAccount, juniorTokenAccount, loading, refresh }
}

export const useTokenAccount = (
  poolInfo: SolanaPoolInfo,
): [Account | undefined, boolean] => {
  const { publicKey } = useWallet()
  const wallet = useAnchorWallet()
  const { connection } = useConnection()
  const [loading, setLoading] = useState<boolean>(true)
  const [account, setAccount] = useState<Account>()

  useEffect(() => {
    async function fetchTokenAccount() {
      setLoading(true)
      if (!publicKey || !connection || !wallet) {
        setLoading(false)
        return
      }

      const associatedTokenAddress = await getAssociatedTokenAddress(
        new PublicKey(poolInfo.underlyingMint.address),
        publicKey,
        true, // allowOwnerOffCurve
        TOKEN_PROGRAM_ID,
      )

      try {
        const tokenAccount = await getAccount(
          connection,
          associatedTokenAddress,
          undefined,
          TOKEN_PROGRAM_ID,
        )
        setAccount(tokenAccount)
      } catch (error) {
        if (error instanceof TokenAccountNotFoundError) {
          setAccount(undefined)
        }

        console.warn(error)
      }

      setLoading(false)
    }

    fetchTokenAccount()
  }, [publicKey, connection, wallet, poolInfo.underlyingMint.address])

  return [account, loading]
}

export const usePoolUnderlyingTokenAccount = (
  poolInfo: SolanaPoolInfo | undefined,
): { account: Account | undefined; loading: boolean; refresh: () => void } => {
  const { connection } = useConnection()
  const [loading, setLoading] = useState<boolean>(true)
  const [account, setAccount] = useState<Account>()
  const [refreshCount, refresh] = useForceRefresh()

  useEffect(() => {
    async function fetchTokenBalance() {
      setLoading(true)
      if (!connection || !poolInfo) {
        setLoading(false)
        return
      }

      try {
        const tokenAccount = await getAccount(
          connection,
          new PublicKey(poolInfo.poolUnderlyingTokenAccount),
          undefined,
          TOKEN_PROGRAM_ID,
        )
        setAccount(tokenAccount)
      } catch (error) {
        if (error instanceof TokenAccountNotFoundError) {
          setAccount(undefined)
        }

        console.warn(error)
      }

      setLoading(false)
    }

    fetchTokenBalance()
  }, [refreshCount, connection, poolInfo])

  return { account, loading, refresh }
}

export type SolanaCreditStatus =
  | 'deleted'
  | 'approved'
  | 'goodStanding'
  | 'delayed'
  | 'defaulted'
export type CreditStateAccount = {
  creditRecord: {
    status: SolanaCreditStatus
    nextDue: BN
    yieldDue: BN
    nextDueDate: BN
    totalPastDue: BN
    missedPeriods: number
    remainingPeriods: number
    unbilledPrincipal: BN
    principal: BN
    totalDueAmount: BN
    payoffAmount: BN
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

export type CreditConfigAccount = {
  creditLimit: BN
  committedAmount: BN
  numPeriods: BN
  yieldBps: BN
  creditAvailable: BN
}

export const useBorrowerAccounts = (
  chainId: SolanaChainEnum,
  poolName: POOL_NAME,
): {
  creditStateAccountPDA: string | null | undefined
  creditStateAccount: CreditStateAccount | null | undefined
  creditConfigAccountPDA: string | null | undefined
  creditConfigAccount: CreditConfigAccount | null | undefined
  loading: boolean
  refresh: () => void
} => {
  const { publicKey } = useWallet()
  const wallet = useAnchorWallet()
  const { connection } = useConnection()
  const [loading, setLoading] = useState<boolean>(true)
  const [creditStateAccountPDA, setCreditStateAccountPDA] = useState<string>()
  const [creditConfigAccountPDA, setCreditConfigAccountPDA] = useState<string>()
  const [creditStateAccount, setCreditStateAccount] =
    useState<CreditStateAccount | null>()
  const [creditConfigAccount, setCreditConfigAccount] =
    useState<CreditConfigAccount | null>()
  const poolInfo = useMemo(
    () => getSolanaPoolInfo(chainId, poolName),
    [chainId, poolName],
  )
  const {
    account: poolUnderlyingTokenAccount,
    refresh: refreshPoolUnderlyingTokenAccount,
  } = usePoolUnderlyingTokenAccount(poolInfo)
  const [refreshCount, refresh] = useForceRefresh()

  useEffect(() => {
    async function fetchBorrowerAccount() {
      setLoading(true)
      if (
        !poolInfo ||
        !publicKey ||
        !connection ||
        !wallet ||
        !poolUnderlyingTokenAccount
      ) {
        setLoading(false)
        return
      }
      const poolProgram = new PublicKey(getPoolProgramAddress(chainId))
      const [creditStateAccountPDACalc] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('credit_state'),
          new PublicKey(poolInfo.poolConfig).toBuffer(),
          publicKey.toBuffer(),
        ],
        poolProgram,
      )
      setCreditStateAccountPDA(creditStateAccountPDACalc.toString())
      const [creditConfigAccountPDACalc] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('credit_config'),
          new PublicKey(poolInfo.poolConfig).toBuffer(),
          publicKey.toBuffer(),
        ],
        poolProgram,
      )
      setCreditConfigAccountPDA(creditConfigAccountPDACalc.toString())

      const program = getHumaProgram(chainId, connection, wallet as Wallet)
      // fetchMultiple will gracefully handle account not found exceptions
      const [creditStateAccountResult, creditConfigAccountResult] =
        await Promise.all([
          program.account.creditState.fetchMultiple([
            creditStateAccountPDACalc,
          ]),
          program.account.creditConfig.fetchMultiple([
            creditConfigAccountPDACalc,
          ]),
        ])

      const result = creditStateAccountResult[0]
      const creditConfig = creditConfigAccountResult[0]
      if (result && creditConfig) {
        let status: SolanaCreditStatus
        if (lodash.isEqual(result.creditRecord.status, { deleted: {} })) {
          status = 'deleted'
        } else if (
          lodash.isEqual(result.creditRecord.status, { approved: {} })
        ) {
          status = 'approved'
        } else if (
          lodash.isEqual(result.creditRecord.status, { goodStanding: {} })
        ) {
          status = 'goodStanding'
        } else if (
          lodash.isEqual(result.creditRecord.status, { delayed: {} })
        ) {
          status = 'delayed'
        } else {
          status = 'defaulted'
        }

        const unbilledPrincipalBN = new BN(
          result.creditRecord.unbilledPrincipal,
        )
        const nextDueBN = new BN(result.creditRecord.nextDue)
        const yieldDueBN = new BN(result.creditRecord.yieldDue)
        const principalPastDueBN = new BN(result.dueDetail.principalPastDue)
        const totalPastDueBN = new BN(result.creditRecord.totalPastDue)
        const principalBN = unbilledPrincipalBN
          .add(nextDueBN)
          .sub(yieldDueBN)
          .add(principalPastDueBN)

        setCreditStateAccount({
          creditRecord: {
            status,
            nextDue: nextDueBN,
            yieldDue: yieldDueBN,
            nextDueDate: new BN(result.creditRecord.nextDueDate),
            totalPastDue: totalPastDueBN,
            missedPeriods: result.creditRecord.missedPeriods,
            remainingPeriods: result.creditRecord.remainingPeriods,
            unbilledPrincipal: unbilledPrincipalBN,
            principal: principalBN,
            totalDueAmount: nextDueBN.add(totalPastDueBN),
            payoffAmount: unbilledPrincipalBN
              .add(nextDueBN)
              .add(totalPastDueBN),
          },
          dueDetail: {
            paid: new BN(result.dueDetail.paid),
            accrued: new BN(result.dueDetail.accrued),
            lateFee: new BN(result.dueDetail.lateFee),
            committed: new BN(result.dueDetail.committed),
            yieldPastDue: new BN(result.dueDetail.yieldPastDue),
            principalPastDue: principalPastDueBN,
            lateFeeUpdatedDate: new BN(result.dueDetail.lateFeeUpdatedDate),
          },
          receivableAvailableCredits: new BN(result.receivableAvailableCredits),
        })

        const creditLimitBN = new BN(creditConfig.creditLimit)
        const principalAmount = unbilledPrincipalBN
          .add(nextDueBN)
          .sub(yieldDueBN)
          .add(principalPastDueBN)
        const unusedCredit = creditLimitBN.sub(principalAmount)
        const poolTokenBalanceBN = new BN(
          poolUnderlyingTokenAccount?.amount?.toString(),
        )
        // Set available credit to the minimum of the pool balance or the credit available amount,
        // since both are upper bounds on the amount of credit that can be borrowed.
        // If either is negative, cap the available credit to 0.
        let creditAvailable = unusedCredit.lt(poolTokenBalanceBN)
          ? unusedCredit
          : poolTokenBalanceBN
        creditAvailable = creditAvailable.ltn(0) ? new BN(0) : creditAvailable
        setCreditConfigAccount({
          creditLimit: creditLimitBN,
          committedAmount: new BN(creditConfig.committedAmount),
          numPeriods: new BN(creditConfig.numPeriods),
          yieldBps: new BN(creditConfig.yieldBps),
          creditAvailable,
        })
      } else {
        setCreditStateAccount(null)
        setCreditConfigAccount(null)
      }

      setLoading(false)
    }

    fetchBorrowerAccount()
  }, [
    chainId,
    poolName,
    publicKey,
    connection,
    wallet,
    refreshCount,
    poolUnderlyingTokenAccount,
    poolInfo,
  ])

  const refreshAll = useCallback(() => {
    refresh()
    refreshPoolUnderlyingTokenAccount()
  }, [refresh, refreshPoolUnderlyingTokenAccount])

  return {
    creditStateAccountPDA,
    creditStateAccount,
    creditConfigAccountPDA,
    creditConfigAccount,
    loading,
    refresh: refreshAll,
  }
}

export type LenderStateAccount = {
  bump: number
  depositRecord: {
    principal: BN
    lastDepositTime: BN
  }
  redemptionRecord: {
    numSharesRequested: BN
    principalRequested: BN
    nextEpochIdToProcess: BN
    totalAmountProcessed: BN
    totalAmountWithdrawn: BN
  }
}

export const useLenderAccounts = (
  chainId: SolanaChainEnum,
  poolName: POOL_NAME,
): {
  juniorLenderApprovedAccountPDA: string | null | undefined
  juniorLenderApproved: boolean | undefined
  seniorLenderApprovedAccountPDA: string | null | undefined
  seniorLenderApproved: boolean | undefined
  juniorLenderStateAccountPDA: string | null | undefined
  juniorLenderStateAccount: LenderStateAccount | null | undefined
  seniorLenderStateAccountPDA: string | null | undefined
  seniorLenderStateAccount: LenderStateAccount | null | undefined
  juniorTrancheWithdrawable: BN | null | undefined
  seniorTrancheWithdrawable: BN | null | undefined
  seniorTrancheMintSupply: BN | null | undefined
  juniorTrancheMintSupply: BN | null | undefined
  loading: boolean
  refresh: () => void
} => {
  const { publicKey } = useWallet()
  const wallet = useAnchorWallet()
  const { connection } = useConnection()
  const [loading, setLoading] = useState<boolean>(true)
  const [juniorLenderApprovedAccountPDA, setJuniorLenderApprovedAccountPDA] =
    useState<string>()
  const [seniorLenderApprovedAccountPDA, setSeniorLenderApprovedAccountPDA] =
    useState<string>()
  const [seniorLenderApproved, setSeniorLenderApproved] = useState<boolean>()
  const [juniorLenderApproved, setJuniorLenderApproved] = useState<boolean>()
  const [seniorLenderStateAccountPDA, setSeniorLenderStateAccountPDA] =
    useState<string>()
  const [juniorLenderStateAccountPDA, setJuniorLenderStateAccountPDA] =
    useState<string>()
  const [juniorLenderStateAccount, setJuniorLenderStateAccount] =
    useState<LenderStateAccount | null>()
  const [seniorLenderStateAccount, setSeniorLenderStateAccount] =
    useState<LenderStateAccount | null>()
  const [juniorTrancheWithdrawable, setJuniorTrancheWithdrawable] =
    useState<BN | null>()
  const [seniorTrancheWithdrawable, setSeniorTrancheWithdrawable] =
    useState<BN | null>()
  const [juniorTrancheMintSupply, setJuniorTrancheMintSupply] =
    useState<BN | null>()
  const [seniorTrancheMintSupply, setSeniorTrancheMintSupply] =
    useState<BN | null>()
  const [refreshCount, refresh] = useForceRefresh()

  useEffect(() => {
    async function fetchLenderAccount() {
      setLoading(true)
      const poolInfo = getSolanaPoolInfo(chainId, poolName)
      if (!poolInfo || !publicKey || !connection || !wallet) {
        setLoading(false)
        return
      }
      const poolProgram = new PublicKey(getPoolProgramAddress(chainId))
      const [seniorLenderAccountPDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('approved_lender'),
          new PublicKey(poolInfo.seniorTrancheMint).toBuffer(),
          publicKey.toBuffer(),
        ],
        poolProgram,
      )
      setSeniorLenderApprovedAccountPDA(seniorLenderAccountPDA.toString())
      const [juniorLenderAccountPDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('approved_lender'),
          new PublicKey(poolInfo.juniorTrancheMint).toBuffer(),
          publicKey.toBuffer(),
        ],
        poolProgram,
      )
      setJuniorLenderApprovedAccountPDA(juniorLenderAccountPDA.toString())
      const [juniorLenderStateAccountPDACalc] =
        PublicKey.findProgramAddressSync(
          [
            Buffer.from('lender_state'),
            new PublicKey(poolInfo.juniorTrancheMint).toBuffer(),
            publicKey.toBuffer(),
          ],
          poolProgram,
        )
      setJuniorLenderStateAccountPDA(juniorLenderStateAccountPDACalc.toString())
      const [seniorLenderStateAccountPDACalc] =
        PublicKey.findProgramAddressSync(
          [
            Buffer.from('lender_state'),
            new PublicKey(poolInfo.seniorTrancheMint).toBuffer(),
            publicKey.toBuffer(),
          ],
          poolProgram,
        )
      setSeniorLenderStateAccountPDA(seniorLenderStateAccountPDACalc.toString())

      const program = getHumaProgram(chainId, connection, wallet as Wallet)
      const [
        lenderApprovedAccounts,
        lenderStateAccounts,
        seniorTrancheMintSupply,
        juniorTrancheMintSupply,
      ] = await Promise.all([
        program.account.lender.fetchMultiple([
          seniorLenderAccountPDA,
          juniorLenderAccountPDA,
        ]),
        program.account.lenderState.fetchMultiple([
          seniorLenderStateAccountPDACalc,
          juniorLenderStateAccountPDACalc,
        ]),
        connection.getTokenSupply(
          new PublicKey(poolInfo.seniorTrancheMint),
          'confirmed',
        ),
        connection.getTokenSupply(
          new PublicKey(poolInfo.juniorTrancheMint),
          'confirmed',
        ),
      ])

      setJuniorTrancheMintSupply(new BN(juniorTrancheMintSupply.value.amount))
      setSeniorTrancheMintSupply(new BN(seniorTrancheMintSupply.value.amount))
      setSeniorLenderApproved(lenderApprovedAccounts[0] !== null)
      setJuniorLenderApproved(lenderApprovedAccounts[1] !== null)
      setSeniorLenderStateAccount(lenderStateAccounts[0])
      setJuniorLenderStateAccount(lenderStateAccounts[1])
      setSeniorTrancheWithdrawable(
        lenderStateAccounts[0]?.redemptionRecord
          ? new BN(
              lenderStateAccounts[0]?.redemptionRecord.totalAmountProcessed,
            ).sub(
              new BN(
                lenderStateAccounts[0]?.redemptionRecord.totalAmountWithdrawn,
              ),
            )
          : null,
      )
      setJuniorTrancheWithdrawable(
        lenderStateAccounts[1]?.redemptionRecord
          ? new BN(
              lenderStateAccounts[1]?.redemptionRecord.totalAmountProcessed,
            ).sub(
              new BN(
                lenderStateAccounts[1]?.redemptionRecord.totalAmountWithdrawn,
              ),
            )
          : null,
      )

      setLoading(false)
    }

    fetchLenderAccount()
  }, [chainId, poolName, publicKey, connection, wallet, refreshCount])

  return {
    juniorLenderApprovedAccountPDA,
    juniorLenderApproved,
    seniorLenderApprovedAccountPDA,
    seniorLenderApproved,
    juniorLenderStateAccountPDA,
    seniorLenderStateAccountPDA,
    seniorLenderStateAccount,
    juniorLenderStateAccount,
    seniorTrancheWithdrawable,
    juniorTrancheWithdrawable,
    seniorTrancheMintSupply,
    juniorTrancheMintSupply,
    loading,
    refresh,
  }
}

export type LendersAccounts = {
  [poolName in POOL_NAME]?: {
    [lender in string]?: {
      juniorLenderStateAccount?: LenderStateAccount | null | undefined
      seniorLenderStateAccount?: LenderStateAccount | null | undefined
    }
  }
}

export const useLendersAccounts = (
  chainId: SolanaChainEnum,
  lenders: string[],
) => {
  const { connection } = useConnection()
  const [lendersAccounts, setLendersAccounts] = useState<LendersAccounts>()
  const lendersStr = lenders.join(',')

  const getLenderStateAccountPDACalcs = useCallback(
    (poolInfo: SolanaPoolInfo, lenderPublicKey: PublicKey) => {
      const poolProgram = new PublicKey(getPoolProgramAddress(chainId))
      const [seniorLenderStateAccountPDACalc] =
        PublicKey.findProgramAddressSync(
          [
            Buffer.from('lender_state'),
            new PublicKey(poolInfo.seniorTrancheMint).toBuffer(),
            lenderPublicKey.toBuffer(),
          ],
          poolProgram,
        )
      const [juniorLenderStateAccountPDACalc] =
        PublicKey.findProgramAddressSync(
          [
            Buffer.from('lender_state'),
            new PublicKey(poolInfo.juniorTrancheMint).toBuffer(),
            lenderPublicKey.toBuffer(),
          ],
          poolProgram,
        )

      return {
        seniorLenderStateAccountPDACalc,
        juniorLenderStateAccountPDACalc,
      }
    },
    [chainId],
  )

  useEffect(() => {
    const fetchData = async () => {
      const lenders = lendersStr.split(',')
      const pools = SOLANA_CHAIN_POOLS_INFO[chainId]
      if (connection) {
        const lenderStateAccountPDACalcs: PublicKey[] = []
        Object.values(pools).forEach((poolInfo) => {
          lenders.forEach((lender) => {
            const {
              seniorLenderStateAccountPDACalc,
              juniorLenderStateAccountPDACalc,
            } = getLenderStateAccountPDACalcs(poolInfo, new PublicKey(lender))
            lenderStateAccountPDACalcs.push(
              seniorLenderStateAccountPDACalc,
              juniorLenderStateAccountPDACalc,
            )
          })
        })

        // @ts-ignore
        const provider = new AnchorProvider(connection, null)
        const humaProgram = new Program<Huma>(HumaSolanaJson as Huma, provider)
        const lendersState =
          await humaProgram.account.lenderState.fetchMultiple(
            lenderStateAccountPDACalcs,
          )

        const result: LendersAccounts = {}
        let currentIndex = 0
        Object.values(pools).forEach((poolInfo) => {
          lenders.forEach((lender) => {
            if (!result[poolInfo.poolName]) {
              result[poolInfo.poolName] = {}
            }
            if (!result[poolInfo.poolName]![lender]) {
              result[poolInfo.poolName]![lender] = {}
            }
            result[poolInfo.poolName]![lender] = {
              seniorLenderStateAccount: lendersState[currentIndex++],
              juniorLenderStateAccount: lendersState[currentIndex++],
            }
          })
        })

        setLendersAccounts(result)
      }
    }
    fetchData()
  }, [connection, getLenderStateAccountPDACalcs, lendersStr, chainId])

  return lendersAccounts
}
