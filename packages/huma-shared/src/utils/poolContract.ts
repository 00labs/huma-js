import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import { BigNumber } from 'ethers'

import { BasePoolConfig, HDT } from '../abis/types'
import { getChainIdFromSignerOrProvider } from './chain'
import { upScale } from './number'
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

export async function getLenderPosition(
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<BigNumber | undefined> {
  if (!account) {
    return undefined
  }
  const chainId = await getChainIdFromSignerOrProvider(provider)
  const poolInfo = getPoolInfo(chainId, poolName, poolType)
  if (!poolInfo) {
    return undefined
  }
  const contract = getContract<HDT>(
    poolInfo.HDT.address,
    poolInfo.HDT.abi,
    provider,
  )
  if (!contract) {
    return undefined
  }

  const position = await contract.withdrawableFundsOf(account)
  const oneCentUSD = BigNumber.from(
    upScale('0.01', poolInfo.poolUnderlyingToken.decimals),
  )
  // if position is less than one cent USD, consider it 0
  if (position.lt(oneCentUSD)) {
    return BigNumber.from(0)
  }
  return position
}
