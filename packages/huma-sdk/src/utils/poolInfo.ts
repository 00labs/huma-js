import {
  POOL_NAME,
  POOL_TYPE,
  PoolContractMap,
  PoolInfoType,
} from '@huma-finance/shared'

/**
 * Returns the pool info based on the provided pool name and type, using the same chain ID as the provider/signer given
 * @param {POOL_NAME} poolName - The name of the pool.
 * @param {POOL_TYPE} poolType - The type of the pool.
 * @returns {PoolInfoType|undefined} - The pool info or undefined if the chain ID is not supported.
 */
export const getPoolInfo = (
  chainId: number,
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
): PoolInfoType | undefined => PoolContractMap[chainId]?.[poolType]?.[poolName]
