import { Contract, ethers } from 'ethers'
import {
  REAL_WORLD_RECEIVABLE_ABI,
  SupplementaryContracts,
  SupplementaryContractsMap,
} from '@huma-finance/core'

import { getContract } from '../utils'

/**
 * Returns an ethers contract instance for the RealWorldReceivable contract
 * associated with the given pool name on the current chain.
 *
 * @param {ethers.providers.Provider | ethers.Signer} signerOrProvider The provider or signer instance to use for the contract.
 * @param {number} chainId The chain id where the contract instance exists
 * @returns {Contract | null} A contract instance for the RealWorldReceivable contract or null if it could not be found.
 */
export function getRealWorldReceivableContract(
  signerOrProvider: ethers.providers.Provider | ethers.Signer,
  chainId: number,
): Contract | null {
  const rwReceivableContract =
    SupplementaryContractsMap[chainId]?.[
      SupplementaryContracts.RealWorldReceivable
    ]

  if (!rwReceivableContract) return null

  return getContract(
    rwReceivableContract,
    REAL_WORLD_RECEIVABLE_ABI,
    signerOrProvider,
  )
}
