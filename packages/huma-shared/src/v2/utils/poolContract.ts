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
  UnderlyingTokenInfoV2,
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

export const getPoolConfigContractV2 = async (
  poolName: POOL_NAME,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) => {
  const poolInfo = getPoolInfoV2(poolName, chainId)
  if (!poolInfo) {
    return null
  }

  const poolContract = getPoolContractV2(poolName, chainId, provider)
  if (!poolContract) {
    return null
  }

  const poolConfig = await poolContract.poolConfig()
  return getContract<PoolConfig>(poolConfig, poolInfo.poolConfigAbi, provider)
}

export const getPoolUnderlyingTokenContractV2 = async (
  poolName: POOL_NAME,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) => {
  const poolConfigContract = await getPoolConfigContractV2(
    poolName,
    chainId,
    provider,
  )
  console.log('pool config contract loaded', new Date())
  if (!poolConfigContract) {
    return null
  }

  const underlyingToken = await poolConfigContract.underlyingToken()
  console.log('underlyingToken address loaded', new Date())
  return getERC20Contract(underlyingToken, provider)
}

export const getPoolSafeContractV2 = async (
  poolName: POOL_NAME,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) => {
  const poolInfo = getPoolInfoV2(poolName, chainId)
  if (!poolInfo) {
    return null
  }

  const poolContract = getPoolContractV2(poolName, chainId, provider)
  if (!poolContract) {
    return null
  }

  const poolConfig = await poolContract.poolConfig()
  return getContract<PoolSafe>(poolConfig, poolInfo.poolSafeAbi, provider)
}

export const getTrancheVaultContractV2 = async (
  poolName: POOL_NAME,
  trancheType: TrancheType,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) => {
  const poolInfo = getPoolInfoV2(poolName, chainId)
  if (!poolInfo) {
    return null
  }

  const poolConfigContract = await getPoolConfigContractV2(
    poolName,
    chainId,
    provider,
  )
  if (!poolConfigContract) {
    return null
  }

  const trancheVault = await poolConfigContract[`${trancheType}Tranche`]()
  return getContract<TrancheVault>(
    trancheVault,
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
  const poolConfigContract = await getPoolConfigContractV2(
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
): Promise<UnderlyingTokenInfoV2 | null> => {
  const underlyingTokenContract = await getPoolUnderlyingTokenContractV2(
    poolName,
    chainId,
    provider,
  )
  console.log('underlyingToken contract loaded', new Date())
  if (!underlyingTokenContract) {
    return null
  }

  const symbol = await underlyingTokenContract.symbol()
  console.log('underlyingToken symbol loaded', new Date())
  const decimals = await underlyingTokenContract.decimals()
  console.log('underlyingToken decimals loaded', new Date())
  return {
    address: underlyingTokenContract.address,
    symbol,
    decimals,
  }
}

export const getPoolUnderlyingTokeStatsV2 = async (
  poolName: POOL_NAME,
  chainId: number | undefined,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<UnderlyingTokenInfoV2 | null> => {
  if (!account) {
    return null
  }
  const underlyingTokenContract = await getPoolUnderlyingTokenContractV2(
    poolName,
    chainId,
    provider,
  )
  if (!underlyingTokenContract) {
    return null
  }

  const symbol = await underlyingTokenContract.symbol()
  const decimals = await underlyingTokenContract.decimals()
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
): Promise<FirstLossCoverInfoV2 | null> => {
  const poolInfo = getPoolInfoV2(poolName, chainId)
  if (!poolInfo) {
    return null
  }
  const poolConfigContract = await getPoolConfigContractV2(
    poolName,
    chainId,
    provider,
  )
  if (!poolConfigContract) {
    return null
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
): Promise<TrancheVaultInfoV2 | null> => {
  const trancheVaultContract = await getTrancheVaultContractV2(
    poolName,
    trancheType,
    chainId,
    provider,
  )
  if (!trancheVaultContract) {
    return null
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
): Promise<TrancheVaultStatsV2 | null> => {
  if (!account) {
    return null
  }
  const trancheVaultContract = await getTrancheVaultContractV2(
    poolName,
    trancheType,
    chainId,
    provider,
  )
  if (!trancheVaultContract) {
    return null
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
): Promise<UnderlyingTokenStatsV2 | null> => {
  if (!account) {
    return null
  }
  const poolInfo = getPoolInfoV2(poolName, chainId)
  if (!poolInfo) {
    return null
  }
  const underLyingTokenContract = await getPoolUnderlyingTokenContractV2(
    poolName,
    chainId,
    provider,
  )
  if (!underLyingTokenContract) {
    return null
  }

  const balance = await underLyingTokenContract.balanceOf(account)

  return { balance }
}
