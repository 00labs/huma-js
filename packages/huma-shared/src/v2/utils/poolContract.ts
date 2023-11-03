import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import { BigNumber } from 'ethers'

import {
  CHAIN_POOLS_INFO_V2,
  FirstLossCoverIndex,
  FirstLossCoverInfoV2,
  PoolInfoV2,
  TrancheType,
  TrancheVaultInfoV2,
  TrancheVaultStatsV2,
  UnderlyingTokenInfo,
  UnderlyingTokenStatsV2,
} from '.'
import { isChainEnum, POOL_NAME } from '../../utils'
import { getContract, getERC20Contract } from '../../utils/web3'
import {
  FirstLossCover,
  Pool,
  PoolConfig,
  PoolSafe,
  TrancheVault,
} from '../abis/types'

export const getPoolInfoV2 = (
  poolName: POOL_NAME,
  chainId: number | undefined,
): PoolInfoV2 | null => {
  if (isChainEnum(chainId)) {
    return CHAIN_POOLS_INFO_V2[chainId][poolName]
  }
  return null
}

export const getPoolContractV2 = (
  poolName: POOL_NAME,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) => {
  const poolInfo = getPoolInfoV2(poolName, chainId)
  if (!poolInfo) {
    return null
  }

  return getContract<Pool>(poolInfo.pool, poolInfo.poolAbi, provider)
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

export const getPoolSafeContractV2 = (
  poolName: POOL_NAME,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) => {
  const poolInfo = getPoolInfoV2(poolName, chainId)
  if (!poolInfo) {
    return null
  }

  return getContract<PoolSafe>(
    poolInfo.poolSafe,
    poolInfo.poolSafeAbi,
    provider,
  )
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

export const getFirstLossCoverContractV2 = async (
  poolName: POOL_NAME,
  firstLossCoverType: FirstLossCoverIndex,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) => {
  const poolInfo = getPoolInfoV2(poolName, chainId)
  if (!poolInfo) {
    return null
  }
  const poolConfigContract = getPoolConfigContractV2(
    poolName,
    chainId,
    provider,
  )
  if (!poolConfigContract) {
    return null
  }

  const trancheVault = await poolConfigContract.getFirstLossCover(
    firstLossCoverType,
  )
  return getContract<FirstLossCover>(
    trancheVault,
    poolInfo.firstLossCoverAbi,
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

export const getFirstLossCoverInfoV2 = async (
  poolName: POOL_NAME,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<FirstLossCoverInfoV2 | undefined> => {
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

  const getFirstLossCoverInfo = async (contract: FirstLossCover) => {
    const totalAssets = await contract.totalAssets()
    return {
      totalAssets,
    }
  }

  const firstLossCoverInfo = await Promise.all(
    firstLossCoverContracts.map((contract) => getFirstLossCoverInfo(contract)),
  )

  let totalAssets = BigNumber.from(0)
  firstLossCoverInfo.forEach((item) => {
    totalAssets = totalAssets.add(item.totalAssets)
  })

  return { totalAssets }
}

export const getTrancheVaultInfoV2 = async (
  poolName: POOL_NAME,
  trancheType: TrancheType,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<TrancheVaultInfoV2 | undefined> => {
  const trancheVaultContract = getTrancheVaultContractV2(
    poolName,
    trancheType,
    chainId,
    provider,
  )
  if (!trancheVaultContract) {
    return undefined
  }

  const totalAssets = await trancheVaultContract.totalAssets()

  return { totalAssets }
}

export const getTrancheVaultStatsV2 = async (
  poolName: POOL_NAME,
  trancheType: TrancheType,
  chainId: number | undefined,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<TrancheVaultStatsV2 | undefined> => {
  if (!account) {
    return undefined
  }
  const trancheVaultContract = getTrancheVaultContractV2(
    poolName,
    trancheType,
    chainId,
    provider,
  )
  if (!trancheVaultContract) {
    return undefined
  }

  const lenderApproved = await trancheVaultContract.hasRole(
    trancheVaultContract.LENDER_ROLE(),
    account,
  )
  const lenderPosition = await trancheVaultContract.balanceOf(account)

  return { lenderApproved, lenderPosition }
}

export const getPoolSafeStatsV2 = async (
  poolName: POOL_NAME,
  chainId: number | undefined,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<UnderlyingTokenStatsV2 | undefined> => {
  if (!account) {
    return undefined
  }
  const poolInfo = getPoolInfoV2(poolName, chainId)
  if (!poolInfo) {
    return undefined
  }
  const underLyingTokenContract = await getPoolUnderlyingTokenContractV2(
    poolName,
    chainId,
    provider,
  )
  if (!underLyingTokenContract) {
    return undefined
  }

  const balance = await underLyingTokenContract.balanceOf(account)

  return { balance }
}
