import {
  POOL_NAME,
  SOLANA_CHAIN_POOLS_INFO,
  SolanaChainEnum,
  getHumaProgram,
} from '@huma-finance/shared'
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'react'

export const useLenderAccounts = (
  chainId: SolanaChainEnum,
  poolName: POOL_NAME,
) => {
  const { publicKey } = useWallet()
  const wallet = useAnchorWallet()
  const { connection } = useConnection()
  const [seniorLenderAccount, setSeniorLenderAccount] = useState<PublicKey>()

  useEffect(() => {
    async function fetchLenderAccount() {
      const metadata = SOLANA_CHAIN_POOLS_INFO[chainId][poolName]
      if (!metadata || !publicKey || !connection || !wallet) {
        return
      }
      const poolProgram = new PublicKey(metadata.pool)
      const [lenderAccountPDA] = PublicKey.findProgramAddressSync(
        [
          new PublicKey(metadata.poolId).toBuffer(), // TODO: This is removed from the updated pool version. Need to deploy a new version to devnet.
          new PublicKey(metadata.seniorTrancheMint).toBuffer(),
          publicKey.toBuffer(),
          Buffer.from('approved_lender'),
        ],
        poolProgram,
      )
      setSeniorLenderAccount(lenderAccountPDA)

      const program = getHumaProgram(chainId, connection, wallet)
      const account = await program.account.lender.fetch(lenderAccountPDA)
      console.log(account)
    }

    fetchLenderAccount()
  }, [chainId, poolName, publicKey, connection, wallet])

  return [seniorLenderAccount]
}
