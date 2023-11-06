import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import { ReceivableFactoringPool } from '../abis/types/ReceivableFactoringPool'
import { POOL_NAME, POOL_TYPE } from '../utils/pool'
import {
  useAccountStats,
  useFeeManager,
  useLenderApproved,
  useLenderPosition,
  usePoolAllowance,
  usePoolBalance,
  usePoolContract,
  usePoolUnderlyingToken,
  usePoolUnderlyingTokenContract,
} from './usePoolContract'

export function useRFPoolContract(
  poolName: POOL_NAME,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  return usePoolContract<ReceivableFactoringPool>(
    poolName,
    POOL_TYPE.Invoice,
    chainId,
    provider,
  )
}

export function useRFPoolUnderlyingTokenContract(
  poolName: POOL_NAME,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  return usePoolUnderlyingTokenContract(
    poolName,
    POOL_TYPE.Invoice,
    chainId,
    provider,
  )
}

export function useRFPoolUnderlyingToken(
  poolName: POOL_NAME,
  chainId: number | undefined,
) {
  return usePoolUnderlyingToken(poolName, POOL_TYPE.Invoice, chainId)
}

export function useRFPoolBalance(
  poolName: POOL_NAME,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  return usePoolBalance(poolName, POOL_TYPE.Invoice, chainId, provider)
}

export function useReceivableStats(
  poolName: POOL_NAME,
  chainId: number | undefined,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  return useAccountStats(
    poolName,
    POOL_TYPE.Invoice,
    chainId,
    account,
    provider,
  )
}

export function useRFFeeManager(
  poolName: POOL_NAME,
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  return useFeeManager(poolName, POOL_TYPE.Invoice, chainId, provider)
}

export function useRFPoolAllowance(
  poolName: POOL_NAME,
  chainId: number | undefined,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  return usePoolAllowance(
    poolName,
    POOL_TYPE.Invoice,
    chainId,
    account,
    provider,
  )
}

export function useRFLenderPosition(
  poolName: POOL_NAME,
  chainId: number | undefined,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  return useLenderPosition(
    poolName,
    POOL_TYPE.Invoice,
    chainId,
    account,
    provider,
  )
}

export function useRFLenderApproved(
  poolName: POOL_NAME,
  chainId: number | undefined,
  account: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  return useLenderApproved(
    poolName,
    POOL_TYPE.Invoice,
    chainId,
    account,
    provider,
  )
}
