import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import { BigNumber } from 'ethers'

import { MaxUint256 } from '@ethersproject/constants'
import {
  BaseCreditPool,
  BasePoolConfig,
  HDT,
  ReceivableFactoringPool,
} from '../abis/types'
import { AccountStats } from '../hooks/usePoolContract'
import { getChainIdFromSignerOrProvider } from './chain'
import { CreditState } from './credit'
import { downScale, upScale } from './number'
import { getPoolInfo, POOL_NAME, POOL_TYPE } from './pool'
import { getContract, getERC20Contract } from './web3'

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

export async function getPoolAllowance(
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<
  | {
      approved: boolean
      allowance: BigNumber
    }
  | undefined
> {
  if (!account) {
    return undefined
  }
  const chainId = await getChainIdFromSignerOrProvider(provider)
  const poolInfo = getPoolInfo(chainId, poolName, poolType)
  if (!poolInfo) {
    return undefined
  }
  const poolUnderlyingTokenContract = getERC20Contract(
    poolInfo.poolUnderlyingToken.address,
    provider,
  )
  if (!poolUnderlyingTokenContract) {
    return undefined
  }
  const allowance = await poolUnderlyingTokenContract.allowance(
    account,
    poolInfo.pool,
  )

  return {
    approved: allowance.gt(MaxUint256.div(2)),
    allowance,
  }
}

export async function getLenderApproved(
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<boolean | undefined> {
  if (!account) {
    return undefined
  }
  const chainId = await getChainIdFromSignerOrProvider(provider)
  const poolInfo = getPoolInfo(chainId, poolName, poolType)
  if (!poolInfo) {
    return undefined
  }
  const contract = getContract<BaseCreditPool>(
    poolInfo.pool,
    poolInfo.poolAbi,
    provider,
  )
  if (!contract) {
    return undefined
  }

  return contract.isApprovedLender(account)
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

export async function getPoolBalance(
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<BigNumber | undefined> {
  const chainId = await getChainIdFromSignerOrProvider(provider)
  const poolInfo = getPoolInfo(chainId, poolName, poolType)
  if (!poolInfo) {
    return undefined
  }
  const poolUnderlyingTokenContract = getERC20Contract(
    poolInfo.poolUnderlyingToken.address,
    provider,
  )
  if (!poolUnderlyingTokenContract) {
    return undefined
  }

  return poolUnderlyingTokenContract.balanceOf(poolInfo.pool)
}

export async function getAccountStats(
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
): Promise<AccountStats | undefined> {
  if (!account) {
    return undefined
  }
  const chainId = await getChainIdFromSignerOrProvider(provider)
  const poolInfo = getPoolInfo(chainId, poolName, poolType)
  if (!poolInfo) {
    return undefined
  }
  const poolContract = getContract<ReceivableFactoringPool>(
    poolInfo.pool,
    poolInfo.poolAbi,
    provider,
  )
  if (!poolContract) {
    return undefined
  }

  const [poolBalance, creditRecord, creditRecordStatic, receivableInfo] =
    await Promise.all([
      getPoolBalance(poolName, poolType, provider),
      poolContract.creditRecordMapping(account),
      poolContract.creditRecordStaticMapping(account),
      poolContract.receivableInfoMapping
        ? poolContract.receivableInfoMapping(account)
        : undefined,
    ])

  if (!poolBalance) {
    return undefined
  }

  const isApproved = creditRecord
    ? creditRecord.state >= CreditState.Approved
    : false

  const payoffWithoutCorrection = creditRecord.unbilledPrincipal.add(
    creditRecord.totalDue,
  )
  const payoff = payoffWithoutCorrection.add(creditRecord.correction)
  const principal = payoffWithoutCorrection.sub(creditRecord.feesAndInterestDue)
  const unusedCredit = creditRecordStatic.creditLimit.sub(principal)
  // Set available credit to the minimum of the pool balance or the credit available amount,
  // since both are upper bounds on the amount of credit that can be borrowed.
  // If either is negative, cap the available credit to 0.
  let creditAvailable = unusedCredit.lt(poolBalance)
    ? unusedCredit
    : poolBalance
  creditAvailable = creditAvailable.lt(0) ? BigNumber.from(0) : creditAvailable

  const { decimals } = poolInfo.poolUnderlyingToken
  return {
    creditRecord,
    creditRecordStatic,
    receivableInfo,
    isApproved,
    payoffAmount: downScale<number>(payoff.toString(), decimals),
    principalAmount: downScale<number>(principal.toString(), decimals),
    creditAvailableAmount: downScale<number>(
      creditAvailable.toString(),
      decimals,
    ),
    totalDueAmount: downScale<number>(
      creditRecord.totalDue.toString(),
      decimals,
    ),
  }
}
