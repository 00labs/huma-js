import {
  JsonRpcProvider,
  TransactionResponse,
  Web3Provider,
} from '@ethersproject/providers'
import {
  getChainIdFromSignerOrProvider,
  getPoolInfoV2,
  getPoolSafeContractV2,
  getPoolUnderlyingTokenContractV2,
  POOL_NAME,
  POOL_TYPE,
  RECEIVABLE_BACKED_CREDIT_LINE_V2_ABI,
} from '@huma-finance/shared'
import { ReceivableBackedCreditLine } from '@huma-finance/shared/src/v2/abis/types'
import { BigNumberish, ethers, Overrides } from 'ethers'
import { getContract } from '../../utils'
import { approveERC20AllowanceIfInsufficient } from '../ERC20ContractHelper'
import { approveReceivableTransferIfNeeded } from './ReceivableContractHelper'

/**
 * Returns an ethers contract instance for the V2 Receivable contract
 * associated with the given pool name on the current chain.
 *
 * @param {ethers.providers.Provider | ethers.Signer} signerOrProvider The provider or signer instance to use for the contract.
 * @param {POOL_NAME} poolName - The name of the credit pool to get the contract instance for.
 * @returns {ReceivableBackedCreditLine | null} A contract instance for the ReceivableBackedCreditLine contract or null if it could not be found.
 */
export async function getReceivableBackedCreditLineContractV2(
  poolName: POOL_NAME,
  signerOrProvider: JsonRpcProvider | Web3Provider | ethers.Signer,
): Promise<ReceivableBackedCreditLine | null> {
  const chainId = await getChainIdFromSignerOrProvider(signerOrProvider)
  const poolInfo = getPoolInfoV2(poolName, chainId)
  if (!poolInfo || poolInfo.poolType !== POOL_TYPE.ReceivableBackedCreditLine) {
    return null
  }

  return getContract<ReceivableBackedCreditLine>(
    poolInfo.poolCredit,
    RECEIVABLE_BACKED_CREDIT_LINE_V2_ABI,
    signerOrProvider,
  )
}

/**
 * Draws down from a pool using a receivable.
 *
 * @async
 * @function
 * @param {ethers.Signer} signer - The signer used to send the transaction.
 * @param {POOL_NAME} poolName - The name of the credit pool to drawdown from.
 * @param {BigNumberish} receivableId - The ID of the receivable.
 * @param {BigNumberish} drawdownAmount - The amount to drawdown.
 * @param {Overrides} [gasOpts] - The gas options to use for the transaction.
 * @returns {Promise<TransactionResponse>} - A Promise of the transaction response.
 */
export async function drawdownWithReceivable(
  signer: ethers.Signer,
  poolName: POOL_NAME,
  receivableId: BigNumberish,
  drawdownAmount: BigNumberish,
  gasOpts: Overrides = {},
): Promise<TransactionResponse> {
  const creditContract = await getReceivableBackedCreditLineContractV2(
    poolName,
    signer,
  )

  if (!creditContract) {
    throw new Error('Could not find credit contract')
  }

  const approveTx = await approveReceivableTransferIfNeeded(
    signer,
    poolName,
    receivableId,
  )
  await approveTx?.wait(5)

  return creditContract.drawdownWithReceivable(
    receivableId,
    drawdownAmount,
    gasOpts,
  )
}

/**
 * Makes a payment with a receivable.
 *
 * @async
 * @function
 * @param {ethers.Signer} signer - The signer used to send the transaction.
 * @param {POOL_NAME} poolName - The name of the pool to interact with.
 * @param {BigNumberish} receivableId - The ID of the receivable.
 * @param {BigNumberish} paymentAmount - The amount to payback.
 * @param {boolean} principalOnly - Whether this payment should ONLY apply to the principal
 * @param {Overrides} [gasOpts] - The gas options to use for the transaction.
 * @returns {Promise<TransactionResponse>} - A Promise of the transaction response.
 */
export async function makePaymentWithReceivable(
  signer: ethers.Signer,
  poolName: POOL_NAME,
  receivableId: BigNumberish,
  paymentAmount: BigNumberish,
  principalOnly: boolean,
  gasOpts: Overrides = {},
): Promise<TransactionResponse> {
  const creditContract = await getReceivableBackedCreditLineContractV2(
    poolName,
    signer,
  )

  if (!creditContract) {
    throw new Error('Could not find credit contract')
  }

  const poolSafeContract = await getPoolSafeContractV2(
    poolName,
    signer.provider as JsonRpcProvider | Web3Provider | undefined,
  )

  if (!poolSafeContract) {
    throw new Error('Could not find pool safe contract')
  }

  const underlyingToken = await getPoolUnderlyingTokenContractV2(
    poolName,
    signer.provider as JsonRpcProvider | Web3Provider | undefined,
  )

  if (!underlyingToken) {
    throw new Error('Could not find underlying token contract')
  }
  const approveERC20Tx = await approveERC20AllowanceIfInsufficient(
    signer,
    underlyingToken.address,
    poolSafeContract.address,
    paymentAmount,
    gasOpts,
  )
  await approveERC20Tx?.wait(5)

  let paymentTx
  if (principalOnly) {
    paymentTx = await creditContract.makePrincipalPaymentWithReceivable(
      receivableId,
      paymentAmount,
      gasOpts,
    )
  } else {
    paymentTx = await creditContract.makePaymentWithReceivable(
      await signer.getAddress(),
      receivableId,
      paymentAmount,
      gasOpts,
    )
  }

  return paymentTx
}

/**
 * Makes a principal payment and drawdown with receivables.
 *
 * @async
 * @function
 * @param {ethers.Signer} signer - The signer used to send the transaction.
 * @param {POOL_NAME} poolName - The name of the pool to interact with.
 * @param {BigNumberish} paymentReceivableId - The ID of the receivable for payment.
 * @param {BigNumberish} paymentAmount - The amount to payback.
 * @param {BigNumberish} drawdownReceivableId - The ID of the drawdown receivable.
 * @param {BigNumberish} drawdownAmount - The amount to drawdown.
 * @param {Overrides} [gasOpts] - The gas options to use for the transaction.
 * @returns {Promise<TransactionResponse>} - A Promise of the transaction response.
 */
export async function makePrincipalPaymentAndDrawdownWithReceivable(
  signer: ethers.Signer,
  poolName: POOL_NAME,
  paymentReceivableId: BigNumberish,
  paymentAmount: BigNumberish,
  drawdownReceivableId: BigNumberish,
  drawdownAmount: BigNumberish,
  gasOpts: Overrides = {},
): Promise<TransactionResponse> {
  const creditContract = await getReceivableBackedCreditLineContractV2(
    poolName,
    signer,
  )

  if (!creditContract) {
    throw new Error('Could not find credit contract')
  }

  const underlyingToken = await getPoolUnderlyingTokenContractV2(
    poolName,
    signer.provider as JsonRpcProvider | Web3Provider | undefined,
  )

  const poolSafeContract = await getPoolSafeContractV2(
    poolName,
    signer.provider as JsonRpcProvider | Web3Provider | undefined,
  )

  if (!poolSafeContract) {
    throw new Error('Could not find pool safe contract')
  }

  if (!underlyingToken) {
    throw new Error('Could not find underlying token contract')
  }

  const approveERC20Tx = await approveERC20AllowanceIfInsufficient(
    signer,
    underlyingToken.address,
    poolSafeContract.address,
    paymentAmount,
    gasOpts,
  )
  await approveERC20Tx?.wait(5)

  const approveTx = await approveReceivableTransferIfNeeded(
    signer,
    poolName,
    drawdownReceivableId,
  )
  await approveTx?.wait(5)

  return creditContract.makePrincipalPaymentAndDrawdownWithReceivable(
    paymentReceivableId,
    paymentAmount,
    drawdownReceivableId,
    drawdownAmount,
    gasOpts,
  )
}
