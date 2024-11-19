import { POOL_NAME } from '../../common'
import { SolanaPoolInfo, SolanaPoolsInfo } from '../pool'

export const findSolanaPoolByPDA = (
  metadata: SolanaPoolsInfo,
  pdaName: keyof SolanaPoolInfo,
  pda: string,
): SolanaPoolInfo | null => {
  for (const poolName of Object.keys(metadata)) {
    const poolInfo = metadata[poolName as POOL_NAME]

    if (poolInfo && poolInfo[pdaName] === pda) {
      return poolInfo
    }
  }

  return null
}
