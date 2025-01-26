import { Contract } from '@ethersproject/contracts'
import { AddressZero } from '@ethersproject/constants'
import { getAddress } from '@ethersproject/address'
import { ethers } from 'ethers'
import { ERC20_ABI, Erc20 } from '@huma-finance/shared'

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

export function getContract<T = Contract>(
  address: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ABI: any,
  signerOrProvider: ethers.providers.Provider | ethers.Signer,
): T {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, signerOrProvider) as T
}

export function getERC20Contract(
  address: string,
  signerOrProvider: ethers.providers.Provider | ethers.Signer,
): Erc20 {
  return getContract<Erc20>(address, ERC20_ABI, signerOrProvider)
}
