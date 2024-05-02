import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import {
  getCreditConfigV2,
  getCreditRecordV2,
  getPoolSafeContractV2,
  CreditRecordStructOutput,
  POOL_NAME,
} from '@huma-finance/shared'
import { ethers } from 'ethers'

/**
 * Returns the current pool balance available for borrowing
 *
 * @param {POOL_NAME} poolName - The name of the credit pool to get the contract instance for.
 * @param {JsonRpcProvider | Web3Provider} provider The provider instance to use for reading from the contract.
 */
export async function getAvailableBalanceForPool(
  poolName: POOL_NAME,
  provider: JsonRpcProvider | Web3Provider,
): Promise<ethers.BigNumber> {
  const safeContract = await getPoolSafeContractV2(poolName, provider)

  if (!safeContract) {
    throw new Error('Could not find safe contract for pool')
  }

  return safeContract.getAvailableBalanceForPool()
}

/**
 * Returns the credit record of the borrower
 *
 * @param {POOL_NAME} poolName - The name of the credit pool to get the contract instance for.
 * @param {string} borrower - The address of the borrower to check the credit record for
 * @param {JsonRpcProvider | Web3Provider} provider The provider instance to use for reading from the contract.
 */
export async function getCreditRecordForPool(
  poolName: POOL_NAME,
  borrower: string,
  provider: JsonRpcProvider | Web3Provider,
): Promise<CreditRecordStructOutput> {
  const creditRecord = await getCreditRecordV2(poolName, borrower, provider)

  if (!creditRecord) {
    throw new Error('Could not find credit record for pool')
  }

  return creditRecord
}

/**
 * Returns the borrower's remaining credit they can use for borrowing. Note that this might not be
 * currently available for borrowing as the credit limit might exceed the available pool balance. Use
 * getPoolBalance() to get the current available pool balance.
 *
 * @param {string} borrower - The address of the borrower to check the available credit for.
 * @param {POOL_NAME} poolName - The name of the credit pool to get the contract instance for.
 * @param {JsonRpcProvider | Web3Provider} provider The provider instance to use for reading from the contract.
 */
export async function getAvailableCreditForPool(
  borrower: string,
  poolName: POOL_NAME,
  provider: JsonRpcProvider | Web3Provider,
): Promise<ethers.BigNumber> {
  const creditConfig = await getCreditConfigV2(poolName, borrower, provider)
  const creditRecord = await getCreditRecordV2(poolName, borrower, provider)

  if (!creditConfig || !creditRecord) {
    throw new Error('Could not find credit config or credit record')
  }

  return creditConfig.creditLimit.sub(creditRecord.unbilledPrincipal)
}
