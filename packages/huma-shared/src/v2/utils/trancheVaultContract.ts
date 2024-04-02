import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import { BigNumber } from 'ethers'

import {
  getChainIdFromSignerOrProvider,
  getContract,
  POOL_NAME,
} from '../../utils'
import { TrancheVault } from '../abis/types'
import { POOL_ABI_V2, TrancheType } from './pool'
import { getPoolInfoV2 } from './poolContract'

export const getTrancheVaultContractV2 = async (
  poolName: POOL_NAME,
  trancheType: TrancheType,
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<TrancheVault | null> => {
  const chainId = await getChainIdFromSignerOrProvider(provider)
  console.log('getTrancheVaultContract: chainId', chainId)
  const poolInfo = getPoolInfoV2(poolName, chainId)
  if (!poolInfo) {
    console.log('getTrancheVaultContract: poolInfo not found')
    return null
  }

  const trancheVault = `${trancheType}TrancheVault` as
    | 'seniorTrancheVault'
    | 'juniorTrancheVault'
  return getContract<TrancheVault>(
    poolInfo[trancheVault],
    POOL_ABI_V2.trancheVaultAbi,
    provider,
  )
}

export type TrancheRedemptionStatus = {
  trancheType: TrancheType
  lenderRedemptionRecords: {
    nextEpochIdToProcess: BigNumber
    numSharesRequested: BigNumber
    principalRequested: BigNumber
    totalAmountProcessed: BigNumber
    totalAmountWithdrawn: BigNumber
  }
  withdrawableAssets: BigNumber
  cancellableRedemptionShares: BigNumber
  cancellableRedemptionAssets: BigNumber
}

export const getTrancheRedemptionStatusV2 = async (
  poolName: POOL_NAME,
  trancheType: TrancheType,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<TrancheRedemptionStatus | undefined> => {
  if (!account) {
    return undefined
  }
  const trancheVault = await getTrancheVaultContractV2(
    poolName,
    trancheType,
    provider,
  )
  if (!trancheVault) {
    return undefined
  }
  const [
    lenderRedemptionRecords,
    withdrawableAssets,
    cancellableRedemptionShares,
  ] = await Promise.all([
    trancheVault.lenderRedemptionRecords(account),
    trancheVault.withdrawableAssets(account),
    trancheVault.cancellableRedemptionShares(account),
  ])

  const cancellableRedemptionAssets = await trancheVault.convertToAssets(
    cancellableRedemptionShares,
  )

  return {
    trancheType,
    lenderRedemptionRecords,
    withdrawableAssets,
    cancellableRedemptionShares,
    cancellableRedemptionAssets,
  }
}

export const getRedemptionStatusV2 = async (
  poolName: POOL_NAME,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<
  | {
      seniorRedemptionStatus: TrancheRedemptionStatus | undefined
      juniorRedemptionStatus: TrancheRedemptionStatus | undefined
    }
  | undefined
> => {
  if (!account) {
    return undefined
  }

  const [seniorRedemptionStatus, juniorRedemptionStatus] = await Promise.all(
    ['senior', 'junior'].map((trancheType) =>
      getTrancheRedemptionStatusV2(
        poolName,
        trancheType as TrancheType,
        account,
        provider,
      ),
    ),
  )

  return {
    seniorRedemptionStatus,
    juniorRedemptionStatus,
  }
}

export const getTrancheAssetsAndShares = async (
  poolName: POOL_NAME,
  trancheType: TrancheType,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<
  | {
      assets: BigNumber
      shares: BigNumber
    }
  | undefined
> => {
  if (!account) {
    return undefined
  }
  const trancheVault = await getTrancheVaultContractV2(
    poolName,
    trancheType,
    provider,
  )
  if (!trancheVault) {
    return undefined
  }

  const assets = await trancheVault.totalAssetsOf(account)
  const shares = await trancheVault.convertToShares(assets)
  return {
    assets,
    shares,
  }
}
