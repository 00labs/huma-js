import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor'
import { Connection, PublicKey } from '@solana/web3.js'

import { POOL_NAME } from '../../utils'
import { SolanaChainEnum } from '../chain'
import { Huma as HumaSolanaDevnet } from '../idl/devnet'
import HumaDevnetIDL from '../idl/devnet.json'
import {
  SOLANA_CHAIN_INFO,
  SOLANA_CHAIN_POOLS_INFO,
  SolanaPoolInfo,
} from '../pool'

export const getPoolProgramAddress = (chainId: SolanaChainEnum) =>
  SOLANA_CHAIN_INFO[chainId].poolProgram

export const getSentinelAddress = (chainId: SolanaChainEnum) =>
  SOLANA_CHAIN_INFO[chainId].sentinel

export const getHumaProgramAuthorityAddress = (chainId: SolanaChainEnum) =>
  SOLANA_CHAIN_INFO[chainId].humaProgramAuthority

export const getSolanaPoolInfo = (
  chainId: SolanaChainEnum,
  poolName: POOL_NAME,
) => SOLANA_CHAIN_POOLS_INFO[chainId][poolName]

export const getHumaProgram = (
  chainId: SolanaChainEnum,
  connection: Connection,
  wallet?: Wallet,
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

export const getCreditAccounts = (
  poolInfo: SolanaPoolInfo,
  publicKey: PublicKey,
): {
  creditConfigAccount: PublicKey
  creditStateAccount: PublicKey
} => {
  const poolProgram = new PublicKey(getPoolProgramAddress(poolInfo.chainId))
  const [creditStateAccountPDACalc] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('credit_state'),
      new PublicKey(poolInfo.poolConfig).toBuffer(),
      publicKey.toBuffer(),
    ],
    poolProgram,
  )
  const [creditConfigAccountPDACalc] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('credit_config'),
      new PublicKey(poolInfo.poolConfig).toBuffer(),
      publicKey.toBuffer(),
    ],
    poolProgram,
  )

  return {
    creditConfigAccount: creditConfigAccountPDACalc,
    creditStateAccount: creditStateAccountPDACalc,
  }
}
