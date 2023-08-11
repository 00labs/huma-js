import { BigNumber } from '@ethersproject/bignumber'
import { BigNumberish, Contract, Overrides, ethers } from 'ethers'
import { POOL_NAME, POOL_TYPE } from '@huma-finance/shared'
import { TransactionResponse } from '@ethersproject/providers'

import {
  getContract,
  getPoolInfo,
  getDefaultGasOptions,
  getERC20Contract,
} from '../utils'

/**
 * Returns an ethers contract instance for a Huma pool contract
 *
 * @param {ethers.providers.Provider | ethers.Signer} signerOrProvider The provider or signer instance to use for the contract.
 * @param {number} chainId The chain id where the contract instance exists
 * @param {POOL_NAME} poolName The name of the pool contract to get.
 * @param {POOL_TYPE} poolType The type of the pool contract to get.
 * @returns {Contract | null} A contract instance for the Pool contract or null if it could not be found.
 */
export function getPoolContract(
  signerOrProvider: ethers.providers.Provider | ethers.Signer,
  chainId: number,
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
): Contract | null {
  const poolInfo = getPoolInfo(chainId, poolName, poolType)

  if (!poolInfo) return null

  return getContract(poolInfo.pool, poolInfo.poolAbi, signerOrProvider)
}

/**
 * Return type of getCreditRecord
 *
 * @memberof getCreditRecord
 * @typedef {Object} CreditRecord
 * @property {BigNumber} unbilledPrincipal - The amount of principal not included in the bill
 * @property {BigNumber} dueDate - Unix timestamp due date of the next payment
 * @property {BigNumber} correction - the adjustment of interest over or under-counted because of drawdown
 *  or principal payment in the middle of a billing period
 * @property {BigNumber} totalDue - The due amount of the next payment
 * @property {BigNumber} feesAndInterestDue - Interest and fees due for the next payment
 * @property {number} missedPeriods - # of consecutive missed payments, for default processing
 * @property {number} remainingPeriods - # of payment periods until the maturity of the credit line
 * @property {number} state - status of the credit line.
 *  For more info: https://github.com/00labs/huma-contracts/blob/b075a8f957de281e0885e37dbd72a422b6a54a38/contracts/libraries/BaseStructs.sol#L49
 */
export type CreditRecord = [
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  number,
  number,
  number,
] & {
  unbilledPrincipal: BigNumber
  dueDate: BigNumber
  correction: BigNumber
  totalDue: BigNumber
  feesAndInterestDue: BigNumber
  missedPeriods: number
  remainingPeriods: number
  state: number
}

/**
 * Gets the credit record of a wallet in a Huma pool. Denominated in the ERC20 tokens of the pool.
 *
 * @namespace getCreditRecord
 * @async
 * @function
 * @param {string} address - The address to lookup.
 * @param {ethers.providers.Provider | ethers.Signer} signerOrProvider - The signer or provider used to read data.
 * @param {number} chainId - The chain ID of the pool. Used to lookup the pool address.
 * @param {POOL_NAME} poolName - The name of the credit pool. Used to lookup the pool address.
 * @param {POOL_TYPE} poolType - The type of the credit pool. Used to lookup the pool address.
 * @returns {Promise<CreditRecord>} - A Promise of the transaction response.
 */
export async function getCreditRecord(
  address: string,
  signerOrProvider: ethers.providers.Provider | ethers.Signer,
  chainId: number,
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
): Promise<CreditRecord> {
  const poolContract = getPoolContract(
    signerOrProvider,
    chainId,
    poolName,
    poolType,
  )

  if (!poolContract) {
    throw new Error('Could not find pool contract')
  }

  return poolContract.creditRecordMapping(address)
}

/**
 * Gets the total due for a Huma pool of the given wallet. Denominated in the ERC20 tokens of the pool.
 *
 * @async
 * @function
 * @param {string} address - The address to lookup.
 * @param {ethers.providers.Provider | ethers.Signer} signerOrProvider - The signer or provider used to read data.
 * @param {number} chainId - The chain ID of the pool. Used to lookup the pool address.
 * @param {POOL_NAME} poolName - The name of the credit pool. Used to lookup the pool address.
 * @param {POOL_TYPE} poolType - The type of the credit pool. Used to lookup the pool address.
 * @returns {Promise<BigNumber>} - A Promise of the transaction response.
 */
export async function getTotalDue(
  address: string,
  signerOrProvider: ethers.providers.Provider | ethers.Signer,
  chainId: number,
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
): Promise<BigNumber> {
  const creditRecord = await getCreditRecord(
    address,
    signerOrProvider,
    chainId,
    poolName,
    poolType,
  )

  return creditRecord.totalDue
}

/**
 * Calls drawdown on a Huma pool contract
 *
 * @async
 * @function
 * @param {ethers.Signer} signer - The signer used to send the transaction.
 * @param {number} chainId - The chain ID of the pool to call drawdown on. Used to lookup the pool address.
 * @param {POOL_NAME} poolName - The name of the credit pool to mint the receivable token from. Used to lookup the pool address.
 * @param {POOL_TYPE} poolType - The type of the credit pool to mint the receivable token from. Used to lookup the pool address.
 * @param {BigNumberish} drawdownAmount - The amount of tokens to withdraw, denominated in the ERC20 tokens of the pool.
 * @param {Overrides} [gasOpts] - The gas options to use for the transaction.
 * @returns {Promise<TransactionResponse>} - A Promise of the transaction response.
 */
export async function drawdownFromPool(
  signer: ethers.Signer,
  chainId: number,
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  drawdownAmount: BigNumberish,
  gasOpts: Overrides = {},
): Promise<TransactionResponse> {
  const poolContract = getPoolContract(signer, chainId, poolName, poolType)

  if (!poolContract) {
    throw new Error('Could not find pool contract')
  }

  gasOpts = await getDefaultGasOptions(gasOpts, chainId)

  // TODO: Generate typechain for pool contract
  return poolContract.drawdown(drawdownAmount, gasOpts)
}

/**
 * Calls makePayment on a Huma pool contract. If the pool does not have sufficient allowance to complete the operation,
 * attempt to first increase the allowance of the pool.
 *
 * @async
 * @function
 * @param {ethers.Signer} signer - The signer used to send the transaction.
 * @param {number} chainId - The chain ID of the pool to call drawdown on. Used to lookup the pool address.
 * @param {POOL_NAME} poolName - The name of the credit pool to mint the receivable token from. Used to lookup the pool address.
 * @param {POOL_TYPE} poolType - The type of the credit pool to mint the receivable token from. Used to lookup the pool address.
 * @param {BigNumberish} paymentAmount - The amount of tokens to payback, denominated in the ERC20 tokens of the pool.
 * @param {Overrides} [gasOpts] - The gas options to use for the transaction.
 * @returns {Promise<TransactionResponse>} - A Promise of the transaction response.
 */
export async function makePaymentToPool(
  signer: ethers.Signer,
  chainId: number,
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  paymentAmount: BigNumberish,
  gasOpts: Overrides = {},
): Promise<TransactionResponse> {
  const poolInfo = getPoolInfo(chainId, poolName, poolType)
  if (!poolInfo?.poolUnderlyingToken.address) {
    throw new Error('Could not find pool underlying token address')
  }
  const poolTokenContract = getERC20Contract(
    poolInfo?.poolUnderlyingToken.address,
    signer,
  )
  const poolContract = getPoolContract(signer, chainId, poolName, poolType)

  if (!poolContract) {
    throw new Error('Could not find pool contract')
  }

  gasOpts = await getDefaultGasOptions(gasOpts, chainId)
  const allowance = await poolTokenContract.allowance(
    await signer.getAddress(),
    poolContract.address,
  )
  if (allowance.lt(paymentAmount)) {
    const approvalTx = await poolTokenContract.approve(
      poolContract.address,
      paymentAmount,
      gasOpts,
    )
    // Wait for 5 block confirmations since this is required for makePayment
    await approvalTx.wait(5)
  }

  // TODO: Generate typechain for pool contract
  return poolContract.makePayment(
    await signer.getAddress(),
    paymentAmount,
    gasOpts,
  )
}

/**
 * Approves an allowance for a Huma pool contract, which is required to do certain actions (e.g. makePayment)
 *
 * @async
 * @function
 * @param {ethers.Signer} signer - The signer used to send the transaction.
 * @param {number} chainId - The chain ID of the pool to call drawdown on. Used to lookup the pool address.
 * @param {POOL_NAME} poolName - The name of the credit pool to mint the receivable token from. Used to lookup the pool address.
 * @param {POOL_TYPE} poolType - The type of the credit pool to mint the receivable token from. Used to lookup the pool address.
 * @param {BigNumberish} allowanceAmount - The amount of tokens to payback, denominated in the ERC20 tokens of the pool.
 * @param {Overrides} [gasOpts] - The gas options to use for the transaction.
 * @returns {Promise<TransactionResponse>} - A Promise of the transaction response.
 */
export async function approvePoolAllowance(
  signer: ethers.Signer,
  chainId: number,
  poolName: POOL_NAME,
  poolType: POOL_TYPE,
  allowanceAmount: BigNumberish,
  gasOpts: Overrides = {},
): Promise<TransactionResponse> {
  const poolInfo = getPoolInfo(chainId, poolName, poolType)
  if (!poolInfo?.poolUnderlyingToken.address) {
    throw new Error('Could not find pool underlying token address')
  }
  const poolTokenContract = getERC20Contract(
    poolInfo?.poolUnderlyingToken.address,
    signer,
  )
  const poolContract = getPoolContract(signer, chainId, poolName, poolType)

  if (!poolContract) {
    throw new Error('Could not find pool contract')
  }

  gasOpts = await getDefaultGasOptions(gasOpts, chainId)

  return poolTokenContract.approve(
    poolContract.address,
    allowanceAmount,
    gasOpts,
  )
}
