import { BN } from '@coral-xyz/anchor'
import {
  POOL_NAME,
  SOLANA_CHAIN_POOLS_INFO,
  SolanaChainEnum,
  SolanaPoolInfo,
  TrancheType,
  getHumaProgram,
} from '@huma-finance/shared'
import {
  Account,
  getAccount,
  getAssociatedTokenAddress,
  getMint,
  Mint,
  TOKEN_2022_PROGRAM_ID,
  TokenAccountNotFoundError,
} from '@solana/spl-token'
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'react'
import { useForceRefresh } from './useForceRefresh'

export const getPoolMetadata = (
  chainId: SolanaChainEnum,
  poolName: POOL_NAME,
) => SOLANA_CHAIN_POOLS_INFO[chainId][poolName]

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
        return
      }

      const [seniorATA, juniorATA] = await Promise.all([
        getAssociatedTokenAddress(
          new PublicKey(poolInfo.seniorTrancheMint),
          publicKey,
          false, // allowOwnerOffCurve
          TOKEN_2022_PROGRAM_ID,
        ),
        getAssociatedTokenAddress(
          new PublicKey(poolInfo.juniorTrancheMint),
          publicKey,
          false, // allowOwnerOffCurve
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
        return
      }

      const associatedTokenAddress = await getAssociatedTokenAddress(
        new PublicKey(poolInfo.underlyingMint.address),
        publicKey,
        false, // allowOwnerOffCurve
        TOKEN_2022_PROGRAM_ID,
      )

      try {
        const tokenAccount = await getAccount(
          connection,
          associatedTokenAddress,
          undefined,
          TOKEN_2022_PROGRAM_ID,
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

export type LenderStateAccount = {
  depositRecord: {
    principal: string
    lastDepositTime: string
  }
  redemptionRecord: {
    numSharesRequested: string
    principalRequested: string
    nextEpochIdToProcess: string
    totalAmountProcessed: string
    totalAmountWithdrawn: string
  }
}

export const useLenderAccounts = (
  chainId: SolanaChainEnum,
  poolName: POOL_NAME,
): {
  seniorLenderApproved: boolean | undefined
  juniorLenderApproved: boolean | undefined
  juniorLenderStateAccountPDA: string | null | undefined
  juniorLenderStateAccount: LenderStateAccount | null | undefined
  seniorLenderStateAccountPDA: string | null | undefined
  seniorLenderStateAccount: LenderStateAccount | null | undefined
  juniorTrancheWithdrawable: BN | undefined
  seniorTrancheWithdrawable: BN | undefined
  loading: boolean
  refresh: () => void
} => {
  const { publicKey } = useWallet()
  const wallet = useAnchorWallet()
  const { connection } = useConnection()
  const [loading, setLoading] = useState<boolean>(true)
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
  const [refreshCount, refresh] = useForceRefresh()

  useEffect(() => {
    async function fetchLenderAccount() {
      setLoading(true)
      const metadata = getPoolMetadata(chainId, poolName)
      if (!metadata || !publicKey || !connection || !wallet) {
        return
      }
      const poolProgram = new PublicKey(metadata.pool)
      const [seniorLenderAccountPDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('approved_lender'),
          new PublicKey(metadata.seniorTrancheMint).toBuffer(),
          publicKey.toBuffer(),
        ],
        poolProgram,
      )
      const [juniorLenderAccountPDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('approved_lender'),
          new PublicKey(metadata.juniorTrancheMint).toBuffer(),
          publicKey.toBuffer(),
        ],
        poolProgram,
      )
      const [juniorLenderStateAccountPDACalc] =
        PublicKey.findProgramAddressSync(
          [
            Buffer.from('lender_state'),
            new PublicKey(metadata.juniorTrancheMint).toBuffer(),
            publicKey.toBuffer(),
          ],
          poolProgram,
        )
      setJuniorLenderStateAccountPDA(juniorLenderStateAccountPDACalc.toString())
      const [seniorLenderStateAccountPDACalc] =
        PublicKey.findProgramAddressSync(
          [
            Buffer.from('lender_state'),
            new PublicKey(metadata.seniorTrancheMint).toBuffer(),
            publicKey.toBuffer(),
          ],
          poolProgram,
        )
      setSeniorLenderStateAccountPDA(seniorLenderStateAccountPDACalc.toString())

      const program = getHumaProgram(chainId, connection, wallet)
      const [lenderApprovedAccounts, lenderStateAccounts] = await Promise.all([
        program.account.lender.fetchMultiple([
          seniorLenderAccountPDA,
          juniorLenderAccountPDA,
        ]),
        program.account.lenderState.fetchMultiple([
          seniorLenderStateAccountPDACalc,
          juniorLenderStateAccountPDACalc,
        ]),
      ])

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
    seniorLenderApproved,
    juniorLenderApproved,
    juniorLenderStateAccountPDA,
    seniorLenderStateAccountPDA,
    seniorLenderStateAccount,
    juniorLenderStateAccount,
    seniorTrancheWithdrawable,
    juniorTrancheWithdrawable,
    loading,
    refresh,
  }
}
