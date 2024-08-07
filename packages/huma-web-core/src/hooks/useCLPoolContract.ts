import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import { BaseCreditPool, POOL_NAME, POOL_TYPE } from '@huma-finance/core'

import {
  useAccountStats,
  useBaseConfigPoolContract,
  useCreditRecord,
  useFeeManager,
  useLenderApproved,
  useLenderPosition,
  usePoolAllowance,
  usePoolBalance,
  usePoolContract,
  usePoolUnderlyingToken,
  usePoolUnderlyingTokenBalance,
  usePoolUnderlyingTokenContract,
} from './usePoolContract'

export function useCLPoolContract(
  poolName: POOL_NAME,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  return usePoolContract<BaseCreditPool>(
    poolName,
    POOL_TYPE.CreditLine,
    chainId,
    provider,
  )
}

export function useCLBaseConfigPoolContract(
  poolName: POOL_NAME,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  return useBaseConfigPoolContract<BaseCreditPool>(
    poolName,
    POOL_TYPE.CreditLine,
    chainId,
    provider,
  )
}

export function useCLPoolUnderlyingTokenContract(
  poolName: POOL_NAME,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  return usePoolUnderlyingTokenContract(
    poolName,
    POOL_TYPE.CreditLine,
    chainId,
    provider,
  )
}

export function useCLPoolUnderlyingToken(
  poolName: POOL_NAME,
  chainId: number | undefined,
) {
  return usePoolUnderlyingToken(poolName, POOL_TYPE.CreditLine, chainId)
}

export function useCLPoolUnderlyingTokenBalance(
  poolName: POOL_NAME,
  chainId: number | undefined,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  return usePoolUnderlyingTokenBalance(
    poolName,
    POOL_TYPE.CreditLine,
    chainId,
    account,
    provider,
  )
}

export function useCLPoolBalance(
  poolName: POOL_NAME,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  return usePoolBalance(poolName, POOL_TYPE.CreditLine, chainId, provider)
}

export function useCLStats(
  poolName: POOL_NAME,
  chainId: number | undefined,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  return useAccountStats(
    poolName,
    POOL_TYPE.CreditLine,
    chainId,
    account,
    provider,
  )
}

export function useCLCreditRecord(
  poolName: POOL_NAME,
  chainId: number | undefined,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  return useCreditRecord(
    poolName,
    POOL_TYPE.CreditLine,
    chainId,
    account,
    provider,
  )
}

export function useCLFeeManager(
  poolName: POOL_NAME,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  return useFeeManager(poolName, POOL_TYPE.CreditLine, chainId, provider)
}

export function useCLPoolAllowance(
  poolName: POOL_NAME,
  chainId: number | undefined,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  return usePoolAllowance(
    poolName,
    POOL_TYPE.CreditLine,
    chainId,
    account,
    provider,
  )
}

export function useCLLenderPosition(
  poolName: POOL_NAME,
  chainId: number | undefined,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  return useLenderPosition(
    poolName,
    POOL_TYPE.CreditLine,
    chainId,
    account,
    provider,
  )
}

export function useCLLenderApproved(
  poolName: POOL_NAME,
  chainId: number | undefined,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  return useLenderApproved(
    poolName,
    POOL_TYPE.CreditLine,
    chainId,
    account,
    provider,
  )
}
