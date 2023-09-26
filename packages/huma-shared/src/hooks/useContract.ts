import { Contract } from '@ethersproject/contracts'
import { useWeb3React } from '@web3-react/core'
import { useMemo } from 'react'

import { JsonRpcProvider } from '@ethersproject/providers'
import ERC20_ABI from '../abis/erc20.json'
import ERC721_ABI from '../abis/erc721.json'
import MULTISEND_ABI from '../abis/Multisend.json'
import TEST_ERC20_ABI from '../abis/TestERC20.json'
import { Erc20, Erc721, TestERC20, Multisend } from '../abis/types'
import {
  SupplementaryContracts,
  SupplementaryContractsMap,
} from '../utils/pool'
import { getContract } from '../utils/web3'
import { FALLBACK_PROVIDERS } from '../v2/hooks/usePool'

// returns null on errors
export function useContract<T extends Contract = Contract>(
  address: string | undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ABI: any,
  withSignerIfPossible = true,
  desiredChain?: number,
  fallbackProviders?: FALLBACK_PROVIDERS,
): T | null {
  const { provider, account, chainId } = useWeb3React()

  return useMemo(() => {
    if (
      !address ||
      !ABI ||
      (!provider && !fallbackProviders) ||
      (desiredChain && chainId !== desiredChain && !fallbackProviders)
    ) {
      return null
    }
    try {
      const providerToUse =
        desiredChain && chainId !== desiredChain && fallbackProviders
          ? new JsonRpcProvider(fallbackProviders[desiredChain])
          : provider

      return getContract(
        address,
        ABI,
        providerToUse as JsonRpcProvider,
        withSignerIfPossible &&
          (!desiredChain || chainId === desiredChain) &&
          account
          ? account
          : undefined,
      )
    } catch (error) {
      return null
    }
  }, [
    address,
    ABI,
    provider,
    chainId,
    withSignerIfPossible,
    account,
    desiredChain,
    fallbackProviders,
  ]) as T
}

export function useERC20Contract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean,
  desiredChain?: number,
  fallbackProviders?: FALLBACK_PROVIDERS,
) {
  return useContract<Erc20>(
    tokenAddress,
    ERC20_ABI,
    withSignerIfPossible,
    desiredChain,
    fallbackProviders,
  )
}

export function useTestERC20Contract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean,
  desiredChain?: number,
  fallbackProviders?: FALLBACK_PROVIDERS,
) {
  return useContract<TestERC20>(
    tokenAddress,
    TEST_ERC20_ABI,
    withSignerIfPossible,
    desiredChain,
    fallbackProviders,
  )
}

export function useERC721Contract(
  NFTAddress?: string,
  withSignerIfPossible?: boolean,
  desiredChain?: number,
  fallbackProviders?: FALLBACK_PROVIDERS,
) {
  return useContract<Erc721>(
    NFTAddress,
    ERC721_ABI,
    withSignerIfPossible,
    desiredChain,
    fallbackProviders,
  )
}

export function useMultiSendContract() {
  const { chainId } = useWeb3React()

  return useContract<Multisend>(
    chainId
      ? SupplementaryContractsMap[chainId]?.[SupplementaryContracts.MultiSend]
      : undefined,
    MULTISEND_ABI,
    true,
  )
}
