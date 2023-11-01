import { AddressZero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import { useMemo } from 'react'

import ERC20_ABI from '../abis/erc20.json'
import MULTISEND_ABI from '../abis/Multisend.json'
import { Erc20, Multisend } from '../abis/types'
import {
  SupplementaryContracts,
  SupplementaryContractsMap,
} from '../utils/pool'
import { getContract, isAddress } from '../utils/web3'

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
