import { Wallet } from '@coral-xyz/anchor'
import { SolanaChainEnum, getHumaProgram } from '@huma-finance/shared'
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react'
import { useMemo } from 'react'

export const useHumaProgram = (chainId: SolanaChainEnum) => {
  const wallet = useAnchorWallet()
  const { connection } = useConnection()

  const program = useMemo(
    () => getHumaProgram(chainId, connection, wallet as Wallet),
    [chainId, connection, wallet],
  )

  return program
}
