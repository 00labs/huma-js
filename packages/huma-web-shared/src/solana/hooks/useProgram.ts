import { AnchorProvider, Program } from '@coral-xyz/anchor'
import {
  Permissionless,
  PermissionlessDevnetIDL,
  PermissionlessIDL,
  PermissionlessVoter,
  PermissionlessVoterIDL,
} from '@huma-finance/shared'
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react'
import { useMemo } from 'react'
import { checkIsDev } from '../../utils'

export const usePermissionlessProgram = () => {
  const isDev = checkIsDev()
  const wallet = useAnchorWallet()
  const { connection } = useConnection()

  const program = useMemo(() => {
    const IDL = isDev ? PermissionlessDevnetIDL : PermissionlessIDL
    // @ts-ignore
    const provider = new AnchorProvider(connection, wallet, {})
    return new Program<Permissionless>(IDL as Permissionless, provider)
  }, [connection, isDev, wallet])

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
