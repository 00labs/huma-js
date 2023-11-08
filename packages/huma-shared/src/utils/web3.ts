import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import {
  JsonRpcProvider,
  JsonRpcSigner,
  Web3Provider,
} from '@ethersproject/providers'

import ERC20_ABI from '../abis/erc20.json'
import { Erc20 } from '../abis/types'

// returns the checksummed address if the address is valid, otherwise returns false
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isAddress(value: any): string | false {
  try {
    // Alphabetical letters must be made lowercase for getAddress to work.
    // See documentation here: https://docs.ethers.io/v5/api/utils/address/
    return getAddress(value.toLowerCase())
  } catch {
    return false
  }
}

// account is not optional
function getSigner(provider: JsonRpcProvider, account: string): JsonRpcSigner {
  return provider.getSigner(account).connectUnchecked()
}

// account is optional
function getProviderOrSigner(
  provider: JsonRpcProvider,
  account?: string,
): JsonRpcProvider | JsonRpcSigner {
  return account ? getSigner(provider, account) : provider
}

// account is optional
export function getContract<T = Contract>(
  address: string | undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ABI: any,
  provider: JsonRpcProvider | Web3Provider | undefined,
  account?: string,
): T | null {
  if (!isAddress(address) || address === AddressZero || !ABI || !provider) {
    return null
  }

  return new Contract(
    address!,
    ABI,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getProviderOrSigner(provider, account) as any,
  ) as T
}

export function getERC20Contract(
  address: string | undefined,
  provider: JsonRpcProvider | Web3Provider | undefined,
) {
  return getContract<Erc20>(address, ERC20_ABI, provider)
}
