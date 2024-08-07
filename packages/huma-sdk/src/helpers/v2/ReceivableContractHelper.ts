import { BigNumber, BigNumberish, Overrides, ethers } from 'ethers'
import {
  POOL_NAME,
  v2Contracts,
  RECEIVABLE_V2_ABI,
  getPoolConfigContractV2,
  getPoolCreditContractV2,
} from '@huma-shan/core'

import {
  JsonRpcProvider,
  TransactionResponse,
  Web3Provider,
} from '@ethersproject/providers'
import { getContract } from '../../utils'

/**
 * Returns an ethers contract instance for the V2 Receivable contract
 * associated with the given pool name on the current chain.
 *
 * @param {POOL_NAME} poolName The name of the pool.
 * @param {ethers.Signer} signer The signer instance to use for the contract.
 * @returns {Contract | null} A contract instance for the Receivable contract or null if it could not be found.
 */
export async function getReceivableContractV2(
  poolName: POOL_NAME,
  signer: ethers.Signer,
): Promise<v2Contracts.Receivable | null> {
  const poolConfigContract = await getPoolConfigContractV2(
    poolName,
    signer.provider as JsonRpcProvider | Web3Provider,
  )

  if (!poolConfigContract) {
    throw new Error('Could not find PoolConfig contract')
  }
  const receivableAsset = await poolConfigContract.receivableAsset()

  return getContract<v2Contracts.Receivable>(
    receivableAsset,
    RECEIVABLE_V2_ABI,
    signer,
  )
}

/**
 * Retrieves the receivable token ID associated with a given reference ID.
 *
 * @param referenceId - The reference ID of the receivable.
 * @param creator - The creator of the receivable.
 * @param poolName - The name of the pool.
 * @param signer - The signer used for the contract interaction.
 * @returns A promise that resolves to the receivable token ID.
 */
export async function getReceivableTokenIdFromReferenceId(
  referenceId: string,
  creator: string,
  poolName: POOL_NAME,
  signer: ethers.Signer,
): Promise<BigNumber> {
  const contract = await getReceivableContractV2(poolName, signer)
  if (!contract) {
    throw new Error('Could not find Receivable contract')
  }

  const referenceIdHash = await contract.getReferenceIdHash(
    referenceId,
    creator,
  )

  return contract.referenceIdHashToTokenId(referenceIdHash)
}

export async function getReceivableReferenceAlreadyExists(
  referenceId: string,
  signerAddress: string,
  poolName: POOL_NAME,
  signer: ethers.Signer,
): Promise<boolean> {
  const tokenId = await getReceivableTokenIdFromReferenceId(
    referenceId,
    signerAddress,
    poolName,
    signer,
  )

  return !tokenId.isZero()
}

export async function approveReceivableTransferIfNeeded(
  signer: ethers.Signer,
  poolName: POOL_NAME,
  receivableId: BigNumberish,
  gasOpts: Overrides = {},
): Promise<TransactionResponse | null> {
  const receivableContract = await getReceivableContractV2(poolName, signer)

  if (!receivableContract) {
    throw new Error('Could not find Receivable contract')
  }

  // Check if the pool is already approved to transfer the receivable
  const provider = signer.provider as JsonRpcProvider | Web3Provider
  const poolCreditContract = await getPoolCreditContractV2(poolName, provider)

  if (!poolCreditContract) {
    throw new Error('Could not find pool credit contract')
  }

  const approvedAddress = await receivableContract.getApproved(receivableId)
  if (
    poolCreditContract.address &&
    approvedAddress === poolCreditContract.address
  ) {
    return null
  }

  return receivableContract.approve(
    poolCreditContract.address,
    receivableId,
    gasOpts,
  )
}
