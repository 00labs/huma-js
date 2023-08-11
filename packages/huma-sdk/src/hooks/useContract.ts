import { Contract } from '@ethersproject/contracts'
import { useMemo } from 'react'
import { ethers } from 'ethers'

import { getContract } from '../utils/web3'

/**
 * Custom hook for creating an ethers instance of a smart contract.
 *
 * @template T - The type of the contract.
 * @param {string | null | undefined} address - The address of the smart contract instance.
 * @param {any} ABI - The ABI of the smart contract.
 * @param {ethers.providers.Provider | ethers.Signer} signerOrProvider - The signer or provider used to sign transactions or retrieve blockchain data.
 * Note that this signerOrProvider must be connected to the same network as the smart contract in question.
 * @returns {T | null} An instance of the smart contract, or null if an error occurs.
 */
export function useContract<T extends Contract = Contract>(
  address: string | null | undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ABI: any,
  signerOrProvider: ethers.providers.Provider | ethers.Signer,
): T | null {
  return useMemo(() => {
    if (!address || !ABI || !signerOrProvider) return null
    try {
      return getContract(address, ABI, signerOrProvider)
    } catch (error) {
      return null
    }
  }, [address, ABI, signerOrProvider]) as T
}
