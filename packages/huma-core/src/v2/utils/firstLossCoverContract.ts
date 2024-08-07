import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import { BigNumber } from 'ethers'

import {
  getChainIdFromSignerOrProvider,
  getContract,
  POOL_NAME,
} from '../../utils'
import { FirstLossCover } from '../abis/types'
import { FirstLossCoverIndex } from '../types'
import { getPoolConfigContractV2, getPoolInfoV2 } from './poolContract'
import { POOL_ABI_V2 } from './pool'

export const getFirstLossCoverTotalAssetsV2 = async (
  poolName: POOL_NAME,
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<{ [x: number]: BigNumber } | undefined> => {
  const chainId = await getChainIdFromSignerOrProvider(provider)
  const poolInfo = getPoolInfoV2(poolName, chainId)
  if (!poolInfo) {
    return undefined
  }
  const poolConfigContract = await getPoolConfigContractV2(poolName, provider)
  if (!poolConfigContract) {
    return undefined
  }
  const firstLossCovers = Object.values(poolInfo.firstLossCovers)
  const firstLossCoverContracts = firstLossCovers
    .map((item) =>
      getContract<FirstLossCover>(
        item,
        POOL_ABI_V2.firstLossCoverAbi,
        provider,
      ),
    )
    .flatMap((item) => (item ? [item] : []))

  const totalAssets = await Promise.all(
    firstLossCoverContracts.map((contract) => contract.totalAssets()),
  )

  const result: { [x: number]: BigNumber } = {}
  Object.keys(FirstLossCoverIndex).forEach((firstLossCoverIndex, index) => {
    const totalAsset = totalAssets[index]
    if (totalAsset) {
      result[Number(firstLossCoverIndex)] = totalAsset
    }
  })

  return result
}
