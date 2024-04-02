import { BigNumberish, Overrides, ethers } from 'ethers'
import { getChainIdFromSignerOrProvider } from '@huma-finance/shared'
import { TransactionResponse } from '@ethersproject/providers'
import { getDefaultGasOptions, getERC20Contract } from '../utils'

/**
 * Approves an ERC20 allowance for a spender address, if the current allowance is insufficient.
 * Allowance is required to do certain actions on the Huma protocol (e.g. makePayment)
 *
 * @async
 * @function
 * @param {ethers.Signer} signer - The signer used to send the transaction.
 * @param {string} tokenAddress - The address of the ERC20 token to approve.
 * @param {string} spenderAddress - The address of the spender to approve an allowance for.
 * @param {BigNumber} allowanceAmount - The amount of tokens to approve, if applicable. Denominated in the ERC20 tokens.
 * @param {Overrides} [gasOpts] - The gas options to use for the transaction.
 * @returns {Promise<TransactionResponse | null>} - A Promise of the transaction response, or null if the allowance was already sufficient.
 */
export async function approveERC20AllowanceIfInsufficient(
  signer: ethers.Signer,
  tokenAddress: string,
  spenderAddress: string,
  allowanceAmount: BigNumberish,
  gasOpts: Overrides = {},
): Promise<TransactionResponse | null> {
  const chainId = await getChainIdFromSignerOrProvider(signer)

  if (!chainId) {
    throw new Error('Could not find chain ID')
  }

  const tokenContract = getERC20Contract(tokenAddress, signer)

  const allowance = await tokenContract.allowance(
    await signer.getAddress(),
    spenderAddress,
  )
  if (allowance.lt(allowanceAmount)) {
    gasOpts = await getDefaultGasOptions(gasOpts, chainId)
    return tokenContract.approve(spenderAddress, allowanceAmount, gasOpts)
  }

  return null
}
