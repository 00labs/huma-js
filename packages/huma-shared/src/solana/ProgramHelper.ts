import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { AnchorWallet } from '@solana/wallet-adapter-react'
import { Connection } from '@solana/web3.js'
import { HumaSolana as HumaSolanaDevnet } from '../v2/idl/devnet'
import HumaDevnetIDL from '../v2/idl/devnet.json'
import { SolanaChainEnum } from '../utils'

export const getHumaProgram = (
  chainId: SolanaChainEnum,
  connection: Connection,
  wallet?: AnchorWallet,
): Program<HumaSolanaDevnet> => {
  const provider = wallet
    ? new AnchorProvider(connection, wallet, {})
    : undefined

  if (chainId === SolanaChainEnum.SolanaDevnet) {
    return new Program<HumaSolanaDevnet>(
      HumaDevnetIDL as HumaSolanaDevnet,
      provider,
    )
  }

  throw new Error('Chain not supported')
}
