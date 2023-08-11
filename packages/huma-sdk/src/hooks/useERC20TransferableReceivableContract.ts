import { Contract, ethers } from 'ethers'
import {
  ERC20_TRANSFERABLE_RECEIVABLE_ABI,
  ERC20TransferableReceivable,
  POOL_NAME,
  POOL_TYPE,
  PoolContractMap,
} from '@huma-finance/shared'

import { useContract } from './useContract'

/**
 * A react hook that returns an ethers contract instance for the ERC20TransferableReceivable contract
 * associated with the given pool name on the current chain.
 *
 * @param {ethers.providers.Provider | ethers.Signer} signerOrProvider The provider or signer instance to use for the contract.
 * @param {number} chainId The chain id where the contract instance exists
 * @param {POOL_NAME} poolName The name of the pool to get the contract for.
 * @returns {Contract | null} A contract instance for the ERC20TransferableReceivable contract or null if it could not be found.
 */
export function useERC20TransferableReceivableContract(
  signerOrProvider: ethers.providers.Provider | ethers.Signer,
  chainId: number,
  poolName: POOL_NAME,
): Contract | null {
  const TransferableReceivableAddress =
    PoolContractMap[chainId]?.[POOL_TYPE.Invoice]?.[poolName]?.assetAddress

  return useContract<ERC20TransferableReceivable>(
    TransferableReceivableAddress,
    ERC20_TRANSFERABLE_RECEIVABLE_ABI,
    signerOrProvider,
  )
}
