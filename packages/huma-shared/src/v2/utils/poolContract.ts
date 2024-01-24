import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import { BigNumber, ethers } from 'ethers'

import {
  BP_FACTOR,
  CHAIN_POOLS_INFO_V2,
  PoolInfoV2,
  TrancheType,
  UnderlyingTokenInfo,
} from '.'
import {
  getChainIdFromSignerOrProvider,
  getContract,
  getERC20Contract,
  isChainEnum,
  POOL_NAME,
} from '../../utils'
import CREDIT_ABI from '../abis/Credit.json'
import CREDIT_MANAGER_ABI from '../abis/CreditManager.json'
import HUMA_CONFIG_ABI from '../abis/HumaConfig.json'
import {
  Credit,
  EpochManager,
  FirstLossCover,
  HumaConfig,
  Pool,
  PoolConfig,
  PoolSafe,
  TrancheVault,
} from '../abis/types'
import {
  CreditRecordStructOutput,
  DueDetailStructOutput,
} from '../abis/types/Credit'
import {
  CreditConfigStructOutput,
  CreditManager,
} from '../abis/types/CreditManager'
import { FirstLossCoverIndex } from '../types'

export const getPoolInfoV2 = (
  poolName: POOL_NAME,
  chainId: number | undefined,
): PoolInfoV2 | null => {
  if (isChainEnum(chainId)) {
    return CHAIN_POOLS_INFO_V2[chainId]?.[poolName]
  }
  return null
}

export const getPoolContractV2 = async (
  poolName: POOL_NAME,
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<Pool | null> => {
  const chainId = await getChainIdFromSignerOrProvider(provider)
  const poolInfo = getPoolInfoV2(poolName, chainId)
  if (!poolInfo) {
    return null
  }
  return getContract<Pool>(poolInfo.pool, poolInfo.poolAbi, provider)
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

export const getPoolCreditManagerContractV2 = async (
  poolName: POOL_NAME,
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<CreditManager | null> => {
  const chainId = await getChainIdFromSignerOrProvider(provider)
  const poolInfo = getPoolInfoV2(poolName, chainId)
  if (!poolInfo) {
    return null
  }
  return getContract<CreditManager>(
    poolInfo.poolCreditManager,
    CREDIT_MANAGER_ABI,
    provider,
  )
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

export const getFirstLossCoverContractV2 = async (
  poolName: POOL_NAME,
  firstLossCoverType: FirstLossCoverIndex,
  provider: JsonRpcProvider | Web3Provider | undefined,
) => {
  const chainId = await getChainIdFromSignerOrProvider(provider)
  const poolInfo = getPoolInfoV2(poolName, chainId)
  if (!poolInfo) {
    return null
  }
  return getContract<FirstLossCover>(
    poolInfo.firstLossCovers[firstLossCoverType],
    poolInfo.firstLossCoverAbi,
    provider,
  )
}

export const getPoolSafeContractV2 = async (
  poolName: POOL_NAME,
  provider: JsonRpcProvider | Web3Provider | undefined,
) => {
  const chainId = await getChainIdFromSignerOrProvider(provider)
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

export const getCreditHashV2 = (
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

export const getCreditRecordV2 = async (
  poolName: POOL_NAME,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<CreditRecordStructOutput | undefined> => {
  if (!account) {
    return undefined
  }
  const chainId = await getChainIdFromSignerOrProvider(provider)
  const poolInfo = getPoolInfoV2(poolName, chainId)
  if (!poolInfo) {
    return undefined
  }

  const creditContract = await getPoolCreditContractV2(poolName, provider)
  if (!creditContract) {
    return undefined
  }

  const creditHash = getCreditHashV2(poolName, chainId, account)
  if (!creditHash) {
    return undefined
  }

  return creditContract.getCreditRecord(creditHash)
}

export const getDueDetailV2 = async (
  poolName: POOL_NAME,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<DueDetailStructOutput | undefined> => {
  if (!account) {
    return undefined
  }
  const chainId = await getChainIdFromSignerOrProvider(provider)
  const poolInfo = getPoolInfoV2(poolName, chainId)
  if (!poolInfo) {
    return undefined
  }

  const creditContract = await getPoolCreditContractV2(poolName, provider)
  if (!creditContract) {
    return undefined
  }

  const creditHash = getCreditHashV2(poolName, chainId, account)
  if (!creditHash) {
    return undefined
  }

  return creditContract.getDueDetail(creditHash)
}

export const getCreditConfigV2 = async (
  poolName: POOL_NAME,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<CreditConfigStructOutput | undefined> => {
  if (!account) {
    return undefined
  }
  const chainId = await getChainIdFromSignerOrProvider(provider)
  const poolInfo = getPoolInfoV2(poolName, chainId)
  if (!poolInfo) {
    return undefined
  }

  const creditManagerContract = await getPoolCreditManagerContractV2(
    poolName,
    provider,
  )
  if (!creditManagerContract) {
    return undefined
  }

  const creditHash = getCreditHashV2(poolName, chainId, account)
  if (!creditHash) {
    return undefined
  }

  return creditManagerContract.getCreditConfig(creditHash)
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

export const getPoolFeeStructureV2 = async (
  poolName: POOL_NAME,
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<
  | {
      yield: number
      minPrincipalRate: number
      lateFee: number
    }
  | undefined
> => {
  const poolConfigContract = await getPoolConfigContractV2(poolName, provider)
  if (!poolConfigContract) {
    return undefined
  }

  const feeStructure = await poolConfigContract.getFeeStructure()
  return {
    yield: feeStructure.yieldInBps / BP_FACTOR.toNumber(),
    minPrincipalRate: feeStructure.minPrincipalRateInBps / BP_FACTOR.toNumber(),
    lateFee: feeStructure.lateFeeBps / BP_FACTOR.toNumber(),
  }
}

// Please refer to: https://docs.google.com/spreadsheets/d/1Pkqj7pcJ6OxFG8ZTYQLAeAKf3ouD0mAzT9AKoH1ym4s/edit#gid=0
export const getApyV2 = async (
  poolName: POOL_NAME,
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<
  | {
      seniorTrancheApy: number
      juniorTrancheApy: number
      firstLossCoverApy: number
    }
  | undefined
> => {
  const chainId = await getChainIdFromSignerOrProvider(provider)
  const poolInfo = getPoolInfoV2(poolName, chainId)
  if (!poolInfo) {
    return undefined
  }
  const poolConfigContract = await getPoolConfigContractV2(poolName, provider)
  if (!poolConfigContract) {
    return undefined
  }

  const getProtocolFeeInBps = async () => {
    const humaConfig = await poolConfigContract.humaConfig()
    const humaConfigContract = getContract(
      humaConfig,
      HUMA_CONFIG_ABI,
      provider,
    ) as HumaConfig
    return humaConfigContract.protocolFeeInBps()
  }

  const getFlcTotalAssetsAndTotalAssetsAfterRisk = async () => {
    const flcConfigs = await Promise.all(
      Object.values(poolInfo.firstLossCovers)
        .filter(
          (firstLossCover) => firstLossCover !== ethers.constants.AddressZero,
        )
        .map((firstLossCover: string) =>
          poolConfigContract.getFirstLossCoverConfig(firstLossCover),
        ),
    )

    const result = {
      flcTotalAssets: BigNumber.from(0),
      flcTotalAssetsAfterRisk: BigNumber.from(0),
    }
    flcConfigs.forEach((flcConfig) => {
      result.flcTotalAssets = result.flcTotalAssets.add(flcConfig.minLiquidity)
      result.flcTotalAssetsAfterRisk = result.flcTotalAssetsAfterRisk.add(
        flcConfig.minLiquidity
          .mul(flcConfig.riskYieldMultiplierInBps)
          .div(BP_FACTOR),
      )
    })
    return {
      flcTotalAssets: result.flcTotalAssets.toNumber(),
      flcTotalAssetsAfterRisk: result.flcTotalAssetsAfterRisk.toNumber(),
    }
  }

  const [
    protocolFeeInBps,
    feeStructure,
    adminRnR,
    lpConfig,
    flcTotalAssetsAndTotalAssetsAfterRisk,
  ] = await Promise.all([
    getProtocolFeeInBps(),
    poolConfigContract.getFeeStructure(),
    poolConfigContract.getAdminRnR(),
    poolConfigContract.getLPConfig(),
    getFlcTotalAssetsAndTotalAssetsAfterRisk(),
  ])

  const BP_FACTOR_NUMBER = BP_FACTOR.toNumber()
  // APY = (1+APR/12)^12 - 1
  const APY = (1 + feeStructure.yieldInBps / BP_FACTOR_NUMBER / 12) ** 12 - 1

  const poolCap = lpConfig.liquidityCap.toNumber()
  const juniorAssets = poolCap / (lpConfig.maxSeniorJuniorRatio + 1)
  const seniorAssets = poolCap - juniorAssets

  const totalProfit = poolCap * APY
  const postPoolProfitRatio =
    (1 - protocolFeeInBps / BP_FACTOR_NUMBER) *
    (1 -
      adminRnR.rewardRateInBpsForPoolOwner / BP_FACTOR_NUMBER -
      adminRnR.rewardRateInBpsForPoolOwner / BP_FACTOR_NUMBER)
  const poolPostProfit = totalProfit * postPoolProfitRatio

  let seniorTrancheApy = 0
  let seniorPostProfit = 0
  if (lpConfig.fixedSeniorYieldInBps > 0) {
    seniorTrancheApy = lpConfig.fixedSeniorYieldInBps / BP_FACTOR_NUMBER
    seniorPostProfit = poolPostProfit - seniorAssets * seniorTrancheApy
  } else {
    const riskAdjustment =
      lpConfig.tranchesRiskAdjustmentInBps / BP_FACTOR_NUMBER
    const seniorProfit =
      seniorAssets * (postPoolProfitRatio * (1 - riskAdjustment) * APY)
    seniorTrancheApy = postPoolProfitRatio * (1 - riskAdjustment) * APY
    seniorPostProfit = poolPostProfit - seniorProfit
  }

  const { flcTotalAssets, flcTotalAssetsAfterRisk } =
    flcTotalAssetsAndTotalAssetsAfterRisk
  const weight = juniorAssets + flcTotalAssetsAfterRisk

  const juniorProfit = (juniorAssets / weight) * seniorPostProfit
  const juniorTrancheApy = juniorProfit / juniorAssets
  const flcProfit = (flcTotalAssetsAfterRisk / weight) * seniorPostProfit
  const firstLossCoverApy = flcProfit / flcTotalAssets

  return {
    seniorTrancheApy,
    juniorTrancheApy,
    firstLossCoverApy,
  }
}

export const getUtilizationRateV2 = async (
  poolName: POOL_NAME,
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<number | undefined> => {
  const chainId = await getChainIdFromSignerOrProvider(provider)
  const poolInfo = getPoolInfoV2(poolName, chainId)
  if (!poolInfo) {
    return undefined
  }
  const poolSafeContract = await getPoolSafeContractV2(poolName, provider)
  if (!poolSafeContract) {
    return undefined
  }

  const [
    seniorTrancheAssets,
    juniorTrancheAssets,
    seniorTrancheUnprocessedProfit,
    juniorTrancheUnprocessedProfit,
    totalBalance,
    availableBalance,
  ] = await Promise.all([
    getTrancheVaultAssetsV2(poolName, 'senior', provider),
    getTrancheVaultAssetsV2(poolName, 'junior', provider),
    poolSafeContract.unprocessedTrancheProfit(poolInfo.seniorTrancheVault),
    poolSafeContract.unprocessedTrancheProfit(poolInfo.juniorTrancheVault),
    poolSafeContract.totalBalance(),
    poolSafeContract.getAvailableBalanceForPool(),
  ])

  const trancheTotalAssets = seniorTrancheAssets!.add(juniorTrancheAssets!)
  const trancheUnprocessedProfit = seniorTrancheUnprocessedProfit!.add(
    juniorTrancheUnprocessedProfit!,
  )
  const totalSupply = trancheTotalAssets.sub(trancheUnprocessedProfit)
  const borrowedBalance = totalBalance.sub(availableBalance)

  if (borrowedBalance.gt(0) && totalSupply.gt(0)) {
    return borrowedBalance.toNumber() / totalSupply.toNumber()
  }
  return 0
}
