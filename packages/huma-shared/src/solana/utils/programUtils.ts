import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor'
import { Connection, PublicKey } from '@solana/web3.js'

import { POOL_NAME } from '../../common'
import { SolanaChainEnum } from '../chain'
import { Huma as HumaProgram } from '../idl/huma'
import HumaIDL from '../idl/huma.json'
import {
  SOLANA_CHAIN_INFO,
  SOLANA_CHAIN_POOLS_INFO,
  SolanaPoolInfo,
} from '../pool'

export const getPoolProgramAddress = (chainId: SolanaChainEnum) =>
  SOLANA_CHAIN_INFO[chainId].poolProgram

export const getSentinelAddress = (chainId: SolanaChainEnum) =>
  SOLANA_CHAIN_INFO[chainId].sentinel

export const getSolanaPoolInfo = (
  chainId: SolanaChainEnum,
  poolName: POOL_NAME,
) => SOLANA_CHAIN_POOLS_INFO[chainId][poolName]

export function getSolanaPoolInfoForPoolAddress(
  chainId: SolanaChainEnum,
  poolAddress: string,
) {
  const poolsInfo = SOLANA_CHAIN_POOLS_INFO[chainId]
  if (!poolsInfo) {
    return null
  }

  let foundPoolInfo = null

  for (const poolInfo of Object.values(poolsInfo)) {
    if (poolInfo.poolId.toLowerCase() === poolAddress.toLowerCase()) {
      foundPoolInfo = poolInfo
      break
    }
  }

  return foundPoolInfo
}

export const getHumaProgram = (
  _chainId: SolanaChainEnum,
  connection: Connection,
  wallet?: Wallet,
): Program<HumaProgram> => {
  const provider = wallet
    ? new AnchorProvider(connection, wallet, {})
    : undefined

  return new Program<HumaProgram>(HumaIDL as HumaProgram, provider)
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
