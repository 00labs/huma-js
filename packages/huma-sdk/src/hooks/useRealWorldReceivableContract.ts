import { Contract, ethers } from 'ethers'
import {
  REAL_WORLD_RECEIVABLE_ABI,
  RealWorldReceivable,
  SupplementaryContracts,
  SupplementaryContractsMap,
} from '@huma-finance/shared'

import { useContract } from './useContract'

/**
 * A react hook that returns an ethers contract instance for the RealWorldReceivable contract
 * associated with the given pool name on the current chain.
 *
 * @param {ethers.providers.Provider | ethers.Signer} signerOrProvider The provider or signer instance to use for the contract.
 * @param {number} chainId The chain id where the contract instance exists
 * @returns {Contract | null} A contract instance for the RealWorldReceivable contract or null if it could not be found.
 */
export function useRealWorldReceivableContract(
  signerOrProvider: ethers.providers.Provider | ethers.Signer,
  chainId: number,
): Contract | null {
  const realWorldReceivable =
    SupplementaryContractsMap[chainId]?.[
      SupplementaryContracts.RealWorldReceivable
    ]

  return useContract<RealWorldReceivable>(
    realWorldReceivable,
    REAL_WORLD_RECEIVABLE_ABI,
    signerOrProvider,
  )
}
