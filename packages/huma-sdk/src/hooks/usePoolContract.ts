import { BigNumber } from '@ethersproject/bignumber'
import { Contract, ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'

import { POOL_NAME, POOL_TYPE } from '@huma-finance/shared'
import { useContract } from './useContract'
import { getPoolInfo } from '../utils/poolInfo'

/**
 * A react hook that returns a contract instance of a specific pool using an ethers provider or signer
 *
 * @namespace usePoolContract
 * @template T - The type of the contract.
 * @param {ethers.providers.Provider | ethers.Signer} signerOrProvider - An ethers signer or provider instance.
 * @param {number} chainId The chain id where the contract instance exists
 * @param {POOL_NAME} poolName - The name of the pool.
 * @param {POOL_TYPE} poolType - The type of the pool.
 * @returns {T} A contract instance of the specific pool.
 */
export function usePoolContract<T extends Contract>(
  signerOrProvider: ethers.providers.Provider | ethers.Signer,
  chainId: number,
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
): T | null {
  const poolInfo = getPoolInfo(chainId, poolName, poolType)
  return useContract<T>(poolInfo?.pool, poolInfo?.poolAbi, signerOrProvider)
}

/**
 * CreditRecordDetails type object representing the details of a credit line.
 *
 * @memberof usePoolContract
 * @typedef {Object} CreditRecordDetails
 * @property {number} aprInBps - The APR (annual percentage rate) in basis points.
 * @property {BigNumber} correction - adjustment of interest over or under-counted because of drawdown
 *  or principal payment in the middle of a billing period
 * @property {BigNumber} creditLimit - The credit limit in the pools base currency.
 * @property {BigNumber} defaultAmount - The amount of the default, if any.
 * @property {BigNumber} dueDate - The due date of the next payment.
 * @property {BigNumber} feesAndInterestDue - The fees and interest due.
 * @property {number} intervalInDays - The interval in days between payment periods.
 * @property {number} missedPeriods - The number of missed periods.
 * @property {number} remainingPeriods - The number of remaining periods before this credit line is considered paid off.
 * @property {number} state - The state of the factorization. Please see the CreditState in huma-contracts for more details.
 * @property {BigNumber} totalDue - The total due amount of this credit line.
 * @property {BigNumber} unbilledPrincipal - The unbilled principal of the next payment.
 */
export type CreditRecordDetails = {
  aprInBps: number
  correction: BigNumber
  creditLimit: BigNumber
  defaultAmount: BigNumber
  dueDate: BigNumber
  feesAndInterestDue: BigNumber
  intervalInDays: number
  missedPeriods: number
  remainingPeriods: number
  state: number
  totalDue: BigNumber
  unbilledPrincipal: BigNumber
}

/**
 * A react hook that returns the credit record details for a user in a given pool, as well as a function to refresh the data.
 *
 * @memberof usePoolContract
 * @param {string} userAddress - The address of the user to get the credit record details for.
 * @param {ethers.providers.Provider | ethers.Signer} signerOrProvider - The signer or provider object to use for the contract.
 * @param {number} chainId The chain id where the contract instance exists
 * @param {POOL_NAME} poolName - The name of the pool to get the credit record details for.
 * @param {POOL_TYPE} poolType - The type of the pool.
 * @returns {Array<CreditRecordDetails | undefined, function():void>} An array containing the credit record details and a function to refresh the data.
 */
export function useCreditRecordDetails(
  userAddress: string,
  signerOrProvider: ethers.providers.Provider | ethers.Signer,
  chainId: number,
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
): [CreditRecordDetails | undefined, () => void] {
  const poolContract = usePoolContract(
    signerOrProvider,
    chainId,
    poolName,
    poolType,
  )
  const [creditRecordDetails, setCreditRecordDetails] =
    useState<CreditRecordDetails>()
  const [refreshCount, setRefreshCount] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      if (poolContract && userAddress) {
        const creditRecordMapping = await poolContract.creditRecordMapping(
          userAddress,
        )
        const creditRecordStaticMapping =
          await poolContract.creditRecordStaticMapping(userAddress)
        setCreditRecordDetails({
          ...creditRecordMapping,
          ...creditRecordStaticMapping,
        })
      }
    }
    fetchData()
  }, [userAddress, poolContract, refreshCount])

  const refresh = useCallback(() => {
    setRefreshCount((pre) => pre + 1)
  }, [])

  return [creditRecordDetails, refresh]
}
