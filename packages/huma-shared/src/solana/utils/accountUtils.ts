import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Connection } from '@solana/web3.js'
import { POOL_NAME } from '../../utils'
import { SolanaChainEnum } from '../chain'
import { Huma as HumaProgram } from '../idl/huma'
import HumaIDL from '../idl/huma.json'
import { getSolanaPoolInfo } from './programUtils'

export const getPoolAccountInfos = async (
  chainId: SolanaChainEnum,
  poolName: POOL_NAME,
  connection: Connection,
) => {
  const poolInfo = getSolanaPoolInfo(chainId, poolName)

  if (!poolInfo) {
    return null
  }

  // @ts-ignore
  const provider = new AnchorProvider(connection, null)
  const humaProgram = new Program<HumaProgram>(HumaIDL as HumaProgram, provider)

  const [humaConfigAccount, poolConfigAccount, poolStateAccount] =
    await Promise.all([
      humaProgram.account.humaConfig.fetch(poolInfo.humaConfig),
      humaProgram.account.poolConfig.fetch(poolInfo.poolConfig),
      humaProgram.account.poolState.fetch(poolInfo.poolState),
    ])

  return {
    humaConfigAccount,
    poolConfigAccount,
    poolStateAccount,
  }
}
