import {
  POOL_NAME,
  SOLANA_CHAIN_POOLS_INFO,
  SolanaChainEnum,
  SolanaPoolInfo,
  getHumaProgram,
} from '@huma-finance/shared'
import {
  Account,
  getAccount,
  getAssociatedTokenAddress,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token'
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'react'

export const getPoolMetadata = (
  chainId: SolanaChainEnum,
  poolName: POOL_NAME,
) => SOLANA_CHAIN_POOLS_INFO[chainId][poolName]

export const useTokenAccount = (
  poolInfo: SolanaPoolInfo,
): [Account | undefined, boolean] => {
  const { publicKey } = useWallet()
  const wallet = useAnchorWallet()
  const { connection } = useConnection()
  const [loading, setLoading] = useState<boolean>(true)
  const [account, setAccount] = useState<Account>()

  useEffect(() => {
    async function fetchLenderAccount() {
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
      const tokenAccount = await getAccount(
        connection,
        associatedTokenAddress,
        undefined,
        TOKEN_2022_PROGRAM_ID,
      )

      setAccount(tokenAccount)
      setLoading(false)
    }

    fetchLenderAccount()
  }, [publicKey, connection, wallet, poolInfo.underlyingMint.address])

  return [account, loading]
}

export const useLenderAccounts = (
  chainId: SolanaChainEnum,
  poolName: POOL_NAME,
) => {
  const { publicKey } = useWallet()
  const wallet = useAnchorWallet()
  const { connection } = useConnection()
  const [loading, setLoading] = useState<boolean>(true)
  const [seniorLenderApproved, setSeniorLenderApproved] = useState<boolean>()
  const [juniorLenderApproved, setJuniorLenderApproved] = useState<boolean>()
  const [seniorLenderAccount, setSeniorLenderAccount] = useState<PublicKey>()
  const [juniorLenderAccount, setJuniorLenderAccount] = useState<PublicKey>()

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
          new PublicKey(metadata.seniorTrancheMint).toBuffer(),
          publicKey.toBuffer(),
          Buffer.from('approved_lender'),
        ],
        poolProgram,
      )
      setSeniorLenderAccount(seniorLenderAccountPDA)
      const [juniorLenderAccountPDA] = PublicKey.findProgramAddressSync(
        [
          new PublicKey(metadata.juniorTrancheMint).toBuffer(),
          publicKey.toBuffer(),
          Buffer.from('approved_lender'),
        ],
        poolProgram,
      )
      setJuniorLenderAccount(juniorLenderAccountPDA)

      const program = getHumaProgram(chainId, connection, wallet)
      const account = await program.account.lender.fetchMultiple([
        seniorLenderAccountPDA,
        juniorLenderAccountPDA,
      ])
      setSeniorLenderApproved(account[0] !== null)
      setJuniorLenderApproved(account[0] !== null)

      setLoading(false)
    }

    fetchLenderAccount()
  }, [chainId, poolName, publicKey, connection, wallet])

  return [
    seniorLenderApproved,
    juniorLenderApproved,
    seniorLenderAccount,
    juniorLenderAccount,
    loading,
  ]
}
