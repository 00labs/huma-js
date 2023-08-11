import { Contract, ethers } from 'ethers'
import {
  ERC20_TRANSFERABLE_RECEIVABLE_ABI,
  SupplementaryContracts,
  SupplementaryContractsMap,
} from '@huma-finance/shared'

import { getContract } from '../utils'

/**
 * Returns an ethers contract instance for the ERC20TransferableReceivable contract
 * associated with the given pool name on the current chain.
 *
 * @param {ethers.providers.Provider | ethers.Signer} signerOrProvider The provider or signer instance to use for the contract.
 * @param {number} chainId The chain id where the contract instance exists
 * @returns {Contract | null} A contract instance for the ERC20TransferableReceivable contract or null if it could not be found.
 */
export function getERC20TransferableReceivableContract(
  signerOrProvider: ethers.providers.Provider | ethers.Signer,
  chainId: number,
): Contract | null {
  const erc20TransferableReceiable =
    SupplementaryContractsMap[chainId]?.[
      SupplementaryContracts.ERC20TransferableReceivable
    ]

  if (!erc20TransferableReceiable) return null

  return getContract(
    erc20TransferableReceiable,
    ERC20_TRANSFERABLE_RECEIVABLE_ABI,
    signerOrProvider,
  )
}
