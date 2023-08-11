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

export function useRFPoolContract(poolName: POOL_NAME) {
  return usePoolContract<ReceivableFactoringPool>(poolName, POOL_TYPE.Invoice)
}

export function useRFPoolUnderlyingTokenContract(poolName: POOL_NAME) {
  return usePoolUnderlyingTokenContract(poolName, POOL_TYPE.Invoice)
}

export function useRFPoolUnderlyingToken(poolName: POOL_NAME) {
  return usePoolUnderlyingToken(poolName, POOL_TYPE.Invoice)
}

export function useRFPoolBalance(poolName: POOL_NAME) {
  return usePoolBalance(poolName, POOL_TYPE.Invoice)
}

export function useReceivableStats(poolName: POOL_NAME, account?: string) {
  return useAccountStats(poolName, POOL_TYPE.Invoice, account)
}

export function useRFFeeManager(poolName: POOL_NAME) {
  return useFeeManager(poolName, POOL_TYPE.Invoice)
}

export function useRFPoolAllowance(poolName: POOL_NAME, account?: string) {
  return usePoolAllowance(poolName, POOL_TYPE.Invoice, account)
}

export function useRFLenderPosition(poolName: POOL_NAME, account?: string) {
  return useLenderPosition(poolName, POOL_TYPE.Invoice, account)
}

export function useRFLenderApproved(poolName: POOL_NAME, account?: string) {
  return useLenderApproved(poolName, POOL_TYPE.Invoice, account)
}
