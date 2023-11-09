import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'

import { BasePoolConfig } from '../abis/types'
import { getChainIdFromSignerOrProvider } from './chain'
import { getPoolInfo, POOL_NAME, POOL_TYPE } from './pool'
import { getContract } from './web3'

export async function getPoolApr(
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<number | undefined> {
  const chainId = await getChainIdFromSignerOrProvider(provider)
  const poolInfo = getPoolInfo(chainId, poolName, poolType)
  if (!poolInfo) {
    return undefined
  }
  const contract = getContract<BasePoolConfig>(
    poolInfo.basePoolConfig,
    poolInfo.basePoolConfigAbi,
    provider,
  )
  if (!contract) {
    return undefined
  }

  const aprInBps = await contract.poolAprInBps()
  return aprInBps.toNumber() / 10000
}
