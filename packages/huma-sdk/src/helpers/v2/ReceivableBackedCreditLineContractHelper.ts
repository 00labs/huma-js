import {
  JsonRpcProvider,
  TransactionResponse,
  Web3Provider,
} from '@ethersproject/providers'
import {
  POOL_NAME,
  getPoolInfoV2,
  getChainIdFromSignerOrProvider,
  POOL_TYPE,
  RECEIVABLE_BACKED_CREDIT_LINE_V2_ABI,
  getPoolUnderlyingTokenContractV2,
} from '@huma-finance/shared'
import { ReceivableBackedCreditLine } from '@huma-finance/shared/src/v2/abis/types'
import { BigNumberish, Overrides, ethers } from 'ethers'
import { getContract } from '../../utils'
import { approveERC20AllowanceIfInsufficient } from '../ERC20ContractHelper'

/**
 * Returns an ethers contract instance for the V2 Receivable contract
 * associated with the given pool name on the current chain.
 *
 * @param {ethers.providers.Provider | ethers.Signer} signerOrProvider The provider or signer instance to use for the contract.
 * @param {number} chainId The chain id where the contract instance exists
 * @returns {Contract | null} A contract instance for the RealWorldReceivable contract or null if it could not be found.
 */
export async function getReceivableBackedCreditlineContractV2(
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
 * @param {BigNumberish} receivableAmount - The amount to drawdown.
 * @param {BigNumberish} receivableId - The ID of the receivable.
 * @param {BigNumberish} drawdownAmount - The amount to drawdown.
 * @param {Overrides} [gasOpts] - The gas options to use for the transaction.
 * @returns {Promise<TransactionResponse>} - A Promise of the transaction response.
 */
export async function drawdownWithReceivable(
  signer: ethers.Signer,
  poolName: POOL_NAME,
  receivableAmount: BigNumberish,
  receivableId: BigNumberish,
  drawdownAmount: BigNumberish,
  gasOpts: Overrides = {},
): Promise<TransactionResponse> {
  const creditContract = await getReceivableBackedCreditlineContractV2(
    poolName,
    signer,
  )

  if (!creditContract) {
    throw new Error('Could not find credit contract')
  }

  const drawdownTx = await creditContract.drawdownWithReceivable(
    await signer.getAddress(),
    { receivableAmount, receivableId },
    drawdownAmount,
    gasOpts,
  )

  return drawdownTx
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
  const creditContract = await getReceivableBackedCreditlineContractV2(
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

  if (underlyingToken) {
    await approveERC20AllowanceIfInsufficient(
      signer,
      underlyingToken.address,
      creditContract.address,
      paymentAmount,
      gasOpts,
    )
  }

  let paymentTx
  if (principalOnly) {
    paymentTx = await creditContract.makePrincipalPaymentWithReceivable(
      await signer.getAddress(),
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
 * @param {number} paymentReceivableId - The ID of the receivable for payment.
 * @param {BigNumberish} paymentAmount - The amount to payback.
 * @param {BigNumberish} drawdownReceivableAmount - The amount for the drawdown receivable.
 * @param {BigNumberish} drawdownReceivableId - The ID of the drawdown receivable.
 * @param {BigNumberish} drawdownAmount - The amount to drawdown.
 * @param {Overrides} [gasOpts] - The gas options to use for the transaction.
 * @returns {Promise<TransactionResponse>} - A Promise of the transaction response.
 */
export async function makePrincipalPaymentAndDrawdownWithReceivable(
  signer: ethers.Signer,
  poolName: POOL_NAME,
  paymentReceivableId: number,
  paymentAmount: BigNumberish,
  drawdownReceivableAmount: BigNumberish,
  drawdownReceivableId: BigNumberish,
  drawdownAmount: BigNumberish,
  gasOpts: Overrides = {},
): Promise<TransactionResponse> {
  const creditContract = await getReceivableBackedCreditlineContractV2(
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

  if (underlyingToken) {
    await approveERC20AllowanceIfInsufficient(
      signer,
      underlyingToken.address,
      creditContract.address,
      paymentAmount,
      gasOpts,
    )
  }

  const paymentTx =
    await creditContract.makePrincipalPaymentAndDrawdownWithReceivable(
      await signer.getAddress(),
      paymentReceivableId,
      paymentAmount,
      {
        receivableAmount: drawdownReceivableAmount,
        receivableId: drawdownReceivableId,
      },
      drawdownAmount,
      gasOpts,
    )

  return paymentTx
}
