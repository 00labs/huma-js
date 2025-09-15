import { AnchorProvider, Program } from '@coral-xyz/anchor'
import {
  Permissionless,
  PermissionlessIDL,
  PermissionlessVoter,
  PermissionlessVoterIDL,
} from '@huma-finance/shared'
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react'
import { useMemo } from 'react'

export const usePermissionlessProgram = () => {
  const wallet = useAnchorWallet()
  const { connection } = useConnection()

  const program = useMemo(() => {
    // @ts-ignore
    const provider = new AnchorProvider(connection, wallet, {})
    return new Program<Permissionless>(
      PermissionlessIDL as Permissionless,
      provider,
    )
  }, [connection, wallet])

  return program
}

export const usePermissionlessStakeProgram = () => {
  const wallet = useAnchorWallet()
  const { connection } = useConnection()

  const program = useMemo(() => {
    // @ts-ignore
    const provider = new AnchorProvider(connection, wallet, {})
    return new Program<PermissionlessVoter>(
      PermissionlessVoterIDL as PermissionlessVoter,
      provider,
    )
  }, [connection, wallet])

  return program
}
