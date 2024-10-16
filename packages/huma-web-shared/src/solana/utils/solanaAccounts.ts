import { Wallet } from '@coral-xyz/anchor'
import {
  getHumaProgram,
  getSolanaPoolInfo,
  POOL_NAME,
  SOLANA_CHAINS,
  SolanaChainEnum,
} from '@huma-finance/shared'
import { Cluster, clusterApiUrl, Connection, PublicKey } from '@solana/web3.js'

export type HumaConfigAccount = {
  protocolFeeBps: number
}

export type PoolConfigAccount = {
  lpConfig: {
    liquidityCap: string
    maxSeniorJuniorRatio: number
    withdrawalLockupPeriodDays: number
    fixedSeniorYieldBps: number
    tranchesRiskAdjustmentBps: number
  }
  feeStructure: { yieldBps: number }
  poolSettings: {
    minDepositAmount: string
    defaultGracePeriodDays: number
  }
  adminRnr: {
    liquidityRateBpsForEa: number
    liquidityRateBpsForPoolOwner: number
    rewardRateBpsForEa: number
    rewardRateBpsForPoolOwner: number
  }
}

export type PoolStateAccount = {
  disbursementReserve: string
  accruedIncomes: {
    eaIncome: string
    protocolIncome: string
    poolOwnerIncome: string
  }
  incomeWithdrawn: {
    eaIncomeWithdrawn: string
    protocolIncomeWithdrawn: string
    poolOwnerIncomeWithdrawn: string
  }
  trancheAssets: { assets: string[] }
  status: { on?: {}; off?: {} }
  currentEpoch: {
    endTime: string
  }
  amountDefaulted: string
  amountOriginated: string
  amountRepaid: string
}

export const getPoolConfigAndStateAccount = async (
  chainId: SolanaChainEnum,
  poolName: POOL_NAME,
  wallet: Wallet,
): Promise<
  | {
      humaConfigAccount: HumaConfigAccount
      poolConfigAccount: PoolConfigAccount
      poolStateAccount: PoolStateAccount
    }
  | undefined
> => {
  const connection = new Connection(
    clusterApiUrl(SOLANA_CHAINS[chainId].name as Cluster),
    'confirmed',
  )
  const poolInfo = getSolanaPoolInfo(chainId, poolName)

  if (!poolInfo || !connection) {
    return undefined
  }

  const program = getHumaProgram(chainId, connection, wallet)

  const [
    humaConfigAccountResult,
    poolConfigAccountResult,
    poolStateAccountResult,
  ] = await Promise.all([
    program.account.humaConfig.fetch(new PublicKey(poolInfo.humaConfig)),
    program.account.poolConfig.fetch(new PublicKey(poolInfo.poolConfig)),
    program.account.poolState.fetch(new PublicKey(poolInfo.poolState)),
  ])

  const humaConfigAccount: HumaConfigAccount = {
    protocolFeeBps: humaConfigAccountResult.protocolFeeBps,
  }

  const { lpConfig, feeStructure, poolSettings, adminRnr } =
    poolConfigAccountResult
  const poolConfigAccount: PoolConfigAccount = {
    lpConfig: { ...lpConfig, liquidityCap: lpConfig.liquidityCap.toString() },
    feeStructure,
    poolSettings: {
      ...poolSettings,
      minDepositAmount: poolSettings.minDepositAmount.toString(),
    },
    adminRnr,
  }

  const {
    accruedIncomes,
    incomeWithdrawn,
    trancheAssets,
    status,
    currentEpoch,
  } = poolStateAccountResult
  const poolStateAccount: PoolStateAccount = {
    disbursementReserve: poolStateAccountResult.disbursementReserve.toString(),
    accruedIncomes: {
      eaIncome: accruedIncomes.eaIncome.toString(),
      protocolIncome: accruedIncomes.protocolIncome.toString(),
      poolOwnerIncome: accruedIncomes.poolOwnerIncome.toString(),
    },
    incomeWithdrawn: {
      eaIncomeWithdrawn: incomeWithdrawn.eaIncomeWithdrawn.toString(),
      protocolIncomeWithdrawn:
        incomeWithdrawn.protocolIncomeWithdrawn.toString(),
      poolOwnerIncomeWithdrawn:
        incomeWithdrawn.poolOwnerIncomeWithdrawn.toString(),
    },
    trancheAssets: { assets: trancheAssets.assets.map((a) => a.toString()) },
    status,
    currentEpoch: { endTime: currentEpoch.endTime.toString() },
    amountDefaulted: poolStateAccountResult.amountDefaulted.toString(),
    amountOriginated: poolStateAccountResult.amountOriginated.toString(),
    amountRepaid: poolStateAccountResult.amountRepaid.toString(),
  }

  return { humaConfigAccount, poolConfigAccount, poolStateAccount }
}
