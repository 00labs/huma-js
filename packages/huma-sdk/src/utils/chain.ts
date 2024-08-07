import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'
import {
  ChainEnum,
  getChainIdFromSignerOrProvider as getChainIdFromSignerOrProviderInternal,
} from '@huma-shan/core'
import { ethers } from 'ethers'

export function getChainConfirmations(chainId: number): number {
  return chainId === ChainEnum.Localhost ? 1 : 5
}

export function isPolygonNetwork(network: number): boolean {
  return network === 137 || network === 80001 || network === 80002
}

/**
 * Get the chain ID from a signer or provider object.
 * @param {JsonRpcProvider | JsonRpcSigner} signerOrProvider - The signer or provider object to get the chain ID from.
 * @returns {number} - The chain ID.
 */
export function getChainIdFromJsonSignerOrProvider(
  signerOrProvider: JsonRpcProvider | JsonRpcSigner,
): number {
  if ('network' in signerOrProvider) {
    return signerOrProvider.network.chainId
  }

  return signerOrProvider.provider.network.chainId
}

/**
 * Get the chain ID from a signer or provider object.
 * @param {ethers.provider.Provider | ethers.Signer} signerOrProvider - The signer or provider object to get the chain ID from.
 * @returns {number} - The chain ID.
 */
export async function getChainIdFromSignerOrProvider(
  signerOrProvider: ethers.providers.Provider | ethers.Signer,
): Promise<number | undefined> {
  return getChainIdFromSignerOrProviderInternal(signerOrProvider)
}
