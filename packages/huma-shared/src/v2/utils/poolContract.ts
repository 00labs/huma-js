import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import { BigNumber, ethers } from 'ethers'
import {
  CreditConfigStructOutput,
  CreditRecordStructOutput,
} from '../abis/types/Credit'
import {
  CHAIN_POOLS_INFO_V2,
  PoolInfoV2,
  TrancheType,
  UnderlyingTokenInfo,
} from '.'
import {
  getChainIdFromSignerOrProvider,
  isChainEnum,
  POOL_NAME,
} from '../../utils'
import CREDIT_ABI from '../abis/Credit.json'
import { getContract, getERC20Contract } from '../../utils/web3'
import {
  Credit,
  EpochManager,
  FirstLossCover,
  PoolConfig,
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

export const getPoolConfigContractV2 = async (
  poolName: POOL_NAME,
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<PoolConfig | null> => {
  const chainId = await getChainIdFromSignerOrProvider(provider)
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
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<ethers.Contract | null> => {
  const poolConfigContract = await getPoolConfigContractV2(poolName, provider)
  if (!poolConfigContract) {
    return null
  }
  const underlyingToken = await poolConfigContract.underlyingToken()
  return getERC20Contract(underlyingToken, provider)
}

export const getPoolUnderlyingTokenBalanceV2 = async (
  poolName: POOL_NAME,
  address: string,
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<BigNumber | null> => {
  const poolUnderlyingTokenContract = await getPoolUnderlyingTokenContractV2(
    poolName,
    provider,
  )
  if (!poolUnderlyingTokenContract) {
    return null
  }
  return poolUnderlyingTokenContract.balanceOf(address)
}

export const getPoolCreditContractV2 = async (
  poolName: POOL_NAME,
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<Credit | null> => {
  const chainId = await getChainIdFromSignerOrProvider(provider)
  const poolInfo = getPoolInfoV2(poolName, chainId)
  if (!poolInfo) {
    return null
  }
  return getContract<Credit>(poolInfo.poolCredit, CREDIT_ABI, provider)
}

export const getTrancheVaultContractV2 = async (
  poolName: POOL_NAME,
  trancheType: TrancheType,
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<TrancheVault | null> => {
  const chainId = await getChainIdFromSignerOrProvider(provider)
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

export const getEpochManagerContractV2 = async (
  poolName: POOL_NAME,
  provider: JsonRpcProvider | Web3Provider | undefined,
) => {
  const chainId = await getChainIdFromSignerOrProvider(provider)
  const poolInfo = getPoolInfoV2(poolName, chainId)
  if (!poolInfo) {
    return null
  }
  return getContract<EpochManager>(
    poolInfo.epochManager,
    poolInfo.epochManagerAbi,
    provider,
  )
}

export const getPoolUnderlyingTokenInfoV2 = async (
  poolName: POOL_NAME,
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<UnderlyingTokenInfo | undefined> => {
  const underlyingTokenContract = await getPoolUnderlyingTokenContractV2(
    poolName,
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
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<BigNumber | undefined> => {
  const chainId = await getChainIdFromSignerOrProvider(provider)
  const poolInfo = getPoolInfoV2(poolName, chainId)
  if (!poolInfo) {
    return undefined
  }
  const poolConfigContract = await getPoolConfigContractV2(poolName, provider)
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
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<BigNumber | undefined> => {
  const trancheVaultContract = await getTrancheVaultContractV2(
    poolName,
    trancheType,
    provider,
  )
  if (!trancheVaultContract) {
    return undefined
  }

  return trancheVaultContract.totalAssets()
}

type LenderPosition = {
  shares: BigNumber
  assets: BigNumber
}

export const getLenderPositionV2 = async (
  poolName: POOL_NAME,
  trancheType: TrancheType,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<LenderPosition | undefined> => {
  if (!account) {
    return undefined
  }
  const vaultContract = await getTrancheVaultContractV2(
    poolName,
    trancheType,
    provider,
  )
  if (!vaultContract) {
    return undefined
  }
  const [shares, assets] = await Promise.all([
    vaultContract.balanceOf(account),
    vaultContract.totalAssetsOf(account),
  ])

  return {
    shares,
    assets,
  }
}

export const getTrancheAssetsToSharesV2 = async (
  poolName: POOL_NAME,
  trancheType: TrancheType,
  provider: JsonRpcProvider | Web3Provider | undefined,
  assets: BigNumber | undefined,
): Promise<BigNumber | undefined> => {
  const trancheVaultContract = await getTrancheVaultContractV2(
    poolName,
    trancheType,
    provider,
  )
  if (!trancheVaultContract || !assets) {
    return undefined
  }

  return trancheVaultContract.convertToShares(assets)
}

export const getTrancheSharesToAssetsV2 = async (
  poolName: POOL_NAME,
  trancheType: TrancheType,
  provider: JsonRpcProvider | Web3Provider | undefined,
  shares: BigNumber | undefined,
): Promise<BigNumber | undefined> => {
  const trancheVaultContract = await getTrancheVaultContractV2(
    poolName,
    trancheType,
    provider,
  )
  if (!trancheVaultContract || !shares) {
    return undefined
  }

  return trancheVaultContract.convertToAssets(shares)
}

export const getCreditHash = (
  poolName: POOL_NAME,
  chainId: number | undefined,
  account: string | undefined,
): string | undefined => {
  if (!account) {
    return undefined
  }
  const poolInfo = getPoolInfoV2(poolName, chainId)
  if (!poolInfo) {
    return undefined
  }

  // Get keccak256 hash of the credit contract and account
  return ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ['address', 'address'],
      [poolInfo.poolCredit, account],
    ),
  )
}

export const getCreditRecord = async (
  poolName: POOL_NAME,
  chainId: number | undefined,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<CreditRecordStructOutput | undefined> => {
  if (!account) {
    return undefined
  }
  const poolInfo = getPoolInfoV2(poolName, chainId)
  if (!poolInfo) {
    return undefined
  }

  const creditContract = await getPoolCreditContractV2(poolName, provider)
  if (!creditContract) {
    return undefined
  }

  const creditHash = getCreditHash(poolName, chainId, account)
  if (!creditHash) {
    return undefined
  }

  return creditContract.getCreditRecord(creditHash)
}

export const getCreditConfig = async (
  poolName: POOL_NAME,
  chainId: number | undefined,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<CreditConfigStructOutput | undefined> => {
  if (!account) {
    return undefined
  }
  const poolInfo = getPoolInfoV2(poolName, chainId)
  if (!poolInfo) {
    return undefined
  }

  const creditContract = await getPoolCreditContractV2(poolName, provider)
  if (!creditContract) {
    return undefined
  }

  const creditHash = getCreditHash(poolName, chainId, account)
  if (!creditHash) {
    return undefined
  }

  return creditContract.getCreditConfig(creditHash)
}

export const getCurrentEpochInfoV2 = async (
  poolName: POOL_NAME,
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<EpochManager.CurrentEpochStructOutput | undefined> => {
  const epochManagerContract = await getEpochManagerContractV2(
    poolName,
    provider,
  )
  if (!epochManagerContract) {
    return undefined
  }

  return epochManagerContract.currentEpoch()
}
