import {
  AssembledTransaction,
  Client as PoolCreditClient,
  CreditRecord,
} from '../packages/poolCredit'
import { StellarWallet } from '../services/StellarWallet'
import { getPoolClient, getPoolCreditClient } from '../utils/client'
import { POOL_NAME, StellarNetwork } from '../utils/network'

/**
 * Returns an soroban contract client instance for the credit line contract
 * associated with the given pool name on the current chain.
 *
 * @param {POOL_NAME} poolName - The name of the credit pool to get the contract instance for.
 * @param {StellarNetwork} network - The stellar network.
 * @param {StellarWallet} wallet - The stellar wallet.
 * @returns {PoolCreditClient | undefined} A contract client instance for the CreditLine contract or undefined if it could not be found.
 */
export function getCreditLineClient(
  poolName: POOL_NAME,
  network: StellarNetwork,
  wallet: StellarWallet,
): PoolCreditClient | undefined {
  return getPoolCreditClient(poolName, network, wallet)
}

/**
 * Returns the current pool balance available for borrowing
 *
 * @param {POOL_NAME} poolName - The name of the credit pool to get the contract instance for.
 * @param {StellarNetwork} network - The stellar network.
 * @param {StellarWallet} wallet - The stellar wallet.
 */
export async function getAvailableBalanceForPool(
  poolName: POOL_NAME,
  network: StellarNetwork,
  wallet: StellarWallet,
): Promise<bigint> {
  const poolCreditClient = getPoolClient(poolName, network, wallet)
  if (!poolCreditClient) {
    throw new Error('Could not find credit contract for pool')
  }

  const { result } = await poolCreditClient.get_available_balance()
  return result
}

/**
 * Returns the credit record of the borrower
 *
 * @param {POOL_NAME} poolName - The name of the credit pool to get the contract instance for.
 * @param {StellarNetwork} network - The stellar network.
 * @param {StellarWallet} wallet - The stellar wallet.
 * @param {string} borrower - The address of the borrower to check the credit record for.
 */
export async function getCreditRecordForPool(
  poolName: POOL_NAME,
  network: StellarNetwork,
  wallet: StellarWallet,
  borrower: string,
): Promise<CreditRecord> {
  const poolCreditClient = getPoolCreditClient(poolName, network, wallet)
  if (!poolCreditClient) {
    throw new Error('Could not find credit contract for pool')
  }

  const { result: creditHash } = await poolCreditClient.get_credit_hash({
    borrower,
  })
  if (!creditHash) {
    throw new Error('Could not find credit hash')
  }

  const { result: creditRecord } = await poolCreditClient.get_credit_record({
    credit_hash: creditHash,
  })
  if (!creditRecord) {
    throw new Error('Could not find credit record')
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
 * @param {StellarNetwork} network - The stellar network.
 * @param {StellarWallet} wallet - The stellar wallet.
 */
export async function getAvailableCreditForPool(
  borrower: string,
  poolName: POOL_NAME,
  network: StellarNetwork,
  wallet: StellarWallet,
): Promise<bigint> {
  const poolCreditClient = getPoolCreditClient(poolName, network, wallet)
  if (!poolCreditClient) {
    throw new Error('Could not find credit contract for pool')
  }

  const { result: creditHash } = await poolCreditClient.get_credit_hash({
    borrower,
  })
  if (!creditHash) {
    throw new Error('Could not find credit hash')
  }

  const { result: creditConfig } = await poolCreditClient.get_credit_config({
    credit_hash: creditHash,
  })
  const { result: creditRecord } = await poolCreditClient.get_credit_record({
    credit_hash: creditHash,
  })

  if (!creditConfig || !creditRecord) {
    throw new Error('Could not find credit config or credit record')
  }

  return creditConfig.credit_limit - creditRecord.unbilled_principal
}

/**
 * Returns borrower's total due amount in bigint format
 * associated with the given pool name on the current chain.
 *
 * @param {POOL_NAME} poolName - The name of the credit pool to get the contract instance for.
 * @param {StellarNetwork} network - The stellar network.
 * @param {StellarWallet} wallet - The stellar wallet.
 * @param {string} borrower - The address of the borrower to check the available credit for.
 * @returns {bigint | null} The account's total due amount in bigint format
 */
export async function getTotalDue(
  poolName: POOL_NAME,
  network: StellarNetwork,
  wallet: StellarWallet,
  borrower: string,
): Promise<bigint | null> {
  const creditRecord = await getCreditRecordForPool(
    poolName,
    network,
    wallet,
    borrower,
  )

  if (!creditRecord) {
    return null
  }

  return creditRecord.next_due + creditRecord.total_past_due
}

/**
 * Draws down from a pool.
 *
 * @async
 * @function
 * @param {POOL_NAME} poolName - The name of the credit pool to get the contract instance for.
 * @param {StellarNetwork} network - The stellar network.
 * @param {StellarWallet} wallet - The stellar wallet.
 * @param {BigNumberish} drawdownAmount - The amount to drawdown.
 * @returns {Promise<AssembledTransaction>} - A Promise of the AssembledTransaction.
 */
export async function drawdown(
  poolName: POOL_NAME,
  network: StellarNetwork,
  wallet: StellarWallet,
  drawdownAmount: bigint,
): Promise<AssembledTransaction<null>> {
  const poolCreditClient = getPoolCreditClient(poolName, network, wallet)
  if (!poolCreditClient) {
    throw new Error('Could not find credit contract for pool')
  }

  const tx = await poolCreditClient.drawdown(
    {
      borrower: wallet.getUserInfo().publicKey,
      amount: drawdownAmount,
    },
    {
      timeoutInSeconds: 30,
    },
  )
  await tx.signAndSend()
  return tx
}

/**
 * Makes a payment.
 *
 * @async
 * @function
 * @param {POOL_NAME} poolName - The name of the credit pool to get the contract instance for.
 * @param {StellarNetwork} network - The stellar network.
 * @param {StellarWallet} wallet - The stellar wallet.
 * @param {bigint} paymentAmount - The amount to payback.
 * @param {boolean} principalOnly - Whether this payment should ONLY apply to the principal
 * @returns {Promise<AssembledTransaction>} - A Promise of the AssembledTransaction.
 */
export async function makePaymentWithReceivable(
  poolName: POOL_NAME,
  network: StellarNetwork,
  wallet: StellarWallet,
  paymentAmount: bigint,
  principalOnly: boolean,
): Promise<AssembledTransaction<readonly [bigint, boolean]>> {
  const poolCreditClient = getPoolCreditClient(poolName, network, wallet)
  if (!poolCreditClient) {
    throw new Error('Could not find credit contract for pool')
  }

  let tx
  if (principalOnly) {
    tx = await poolCreditClient.make_principal_payment(
      {
        borrower: wallet.getUserInfo().publicKey,
        amount: paymentAmount,
      },
      {
        timeoutInSeconds: 30,
      },
    )
  } else {
    tx = await poolCreditClient.make_payment(
      {
        caller: wallet.getUserInfo().publicKey,
        borrower: wallet.getUserInfo().publicKey,
        amount: paymentAmount,
      },
      {
        timeoutInSeconds: 30,
      },
    )
  }

  await tx.signAndSend()
  return tx
}
