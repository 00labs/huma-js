import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import { BigNumber } from 'ethers'

import {
  CHAIN_POOLS_INFO_V2,
  PoolInfoV2,
  TrancheType,
  UnderlyingTokenInfo,
} from '.'
import { isChainEnum, POOL_NAME } from '../../utils'
import { getContract, getERC20Contract } from '../../utils/web3'
import { FirstLossCover, PoolConfig, TrancheVault } from '../abis/types'

export const getPoolInfoV2 = (
  poolName: POOL_NAME,
  chainId: number | undefined,
): PoolInfoV2 | null => {
  if (isChainEnum(chainId)) {
    return CHAIN_POOLS_INFO_V2[chainId][poolName]
  }
  return null
}

export const getPoolConfigContractV2 = (
  poolName: POOL_NAME,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) => {
  const poolInfo = getPoolInfoV2(poolName, chainId)
  if (!poolInfo) {
    return null
  }
  return getContract<PoolConfig>(
    poolInfo.poolConfig,
    poolInfo.poolConfigAbi,
    provider,
  )
}

export const getPoolUnderlyingTokenContractV2 = async (
  poolName: POOL_NAME,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) => {
  const poolConfigContract = getPoolConfigContractV2(
    poolName,
    chainId,
    provider,
  )
  if (!poolConfigContract) {
    return null
  }

  const underlyingToken = await poolConfigContract.underlyingToken()
  return getERC20Contract(underlyingToken, provider)
}

export const getTrancheVaultContractV2 = (
  poolName: POOL_NAME,
  trancheType: TrancheType,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) => {
  const poolInfo = getPoolInfoV2(poolName, chainId)
  if (!poolInfo) {
    return null
  }

  const trancheVault = `${trancheType}TrancheVault` as
    | 'seniorTrancheVault'
    | 'juniorTrancheVault'
  return getContract<TrancheVault>(
    poolInfo[trancheVault],
    poolInfo.trancheVaultAbi,
    provider,
  )
}

export const getPoolUnderlyingTokenInfoV2 = async (
  poolName: POOL_NAME,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<UnderlyingTokenInfo | undefined> => {
  const underlyingTokenContract = await getPoolUnderlyingTokenContractV2(
    poolName,
    chainId,
    provider,
  )
  if (!underlyingTokenContract) {
    return undefined
  }

  const [symbol, decimals] = await Promise.all([
    underlyingTokenContract.symbol(),
    underlyingTokenContract.decimals(),
  ])
  return {
    address: underlyingTokenContract.address,
    symbol,
    decimals,
  }
}

export const getFirstLossCoverAssetsV2 = async (
  poolName: POOL_NAME,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<BigNumber | undefined> => {
  const poolInfo = getPoolInfoV2(poolName, chainId)
  if (!poolInfo) {
    return undefined
  }
  const poolConfigContract = getPoolConfigContractV2(
    poolName,
    chainId,
    provider,
  )
  if (!poolConfigContract) {
    return undefined
  }
  const firstLossCovers = await poolConfigContract.getFirstLossCovers()
  const firstLossCoverContracts = firstLossCovers
    .filter((item) => !!item)
    .map((item) =>
      getContract<FirstLossCover>(item, poolInfo.firstLossCoverAbi, provider),
    )
    .flatMap((item) => (item ? [item] : []))

  const firstLossCoverAssets = await Promise.all(
    firstLossCoverContracts.map((contract) => contract.totalAssets()),
  )

  let totalAssets = BigNumber.from(0)
  firstLossCoverAssets.forEach((assets) => {
    totalAssets = totalAssets.add(assets)
  })

  return totalAssets
}

export const getTrancheVaultAssetsV2 = async (
  poolName: POOL_NAME,
  trancheType: TrancheType,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<BigNumber | undefined> => {
  const trancheVaultContract = getTrancheVaultContractV2(
    poolName,
    trancheType,
    chainId,
    provider,
  )
  if (!trancheVaultContract) {
    return undefined
  }

  return trancheVaultContract.totalAssets()
}