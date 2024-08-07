import { AddressZero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import {
  Erc20,
  ERC20_ABI,
  getContract,
  isAddress,
  Multisend,
  MULTISEND_ABI,
  SupplementaryContracts,
  SupplementaryContractsMap,
  TEST_ERC20_ABI,
  TestERC20,
} from '@huma-finance/core'
import { useMemo } from 'react'

// returns null on errors
export function useContract<T extends Contract = Contract>(
  address: string | undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ABI: any,
  provider: JsonRpcProvider | Web3Provider | undefined,
  account?: string,
): T | null {
  return useMemo(() => {
    if (!isAddress(address) || address === AddressZero || !ABI || !provider) {
      return null
    }
    try {
      return getContract(address, ABI, provider, account)
    } catch (error) {
      return null
    }
  }, [ABI, account, address, provider]) as T
}

export function useERC20Contract(
  tokenAddress: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  return useContract<Erc20>(tokenAddress, ERC20_ABI, provider)
}

export function useMultiSendContract(
  chainId: number | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  return useContract<Multisend>(
    chainId
      ? SupplementaryContractsMap[chainId]?.[SupplementaryContracts.MultiSend]
      : undefined,
    MULTISEND_ABI,
    provider,
  )
}

export function useTestERC20Contract(
  tokenAddress: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
  account?: string,
) {
  return useContract<TestERC20>(tokenAddress, TEST_ERC20_ABI, provider, account)
}
