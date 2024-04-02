import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'
import { getChainIdFromSignerOrProvider as getChainIdFromSignerOrProviderInternal } from '@huma-finance/shared'
import { ethers } from 'ethers'

export function isPolygonNetwork(network: number): boolean {
  return network === 137 || network === 80001
}

/**
 * Get the chain ID from a signer or provider object.
 * @param {JsonRpcProvider | JsonRpcSigner} signerOrProvider - The signer or provider object to get the chain ID from.
 * @returns {number} - The chain ID.
 */
export function getChainIdFromJsonSignerOrProvider(
  signerOrProvider: JsonRpcProvider | JsonRpcSigner,
): number {
  return signerOrProvider instanceof JsonRpcProvider
    ? signerOrProvider.network.chainId
    : signerOrProvider.provider.network.chainId
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
