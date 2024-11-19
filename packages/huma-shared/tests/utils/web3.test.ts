/* eslint-disable @typescript-eslint/no-explicit-any */
import { AddressZero } from '@ethersproject/constants'
import { JsonRpcProvider } from '@ethersproject/providers'
import { Contract } from 'ethers'
import { getContract, isAddress } from '../../src/evm/utils/web3'

describe('isAddress', () => {
  it('returns the checksummed address if the address is valid', () => {
    const validAddress = '0xc25d7d92c877ceeabdec52e77a0df35be9964fc4'
    const expectedChecksummedAddress =
      '0xC25D7D92c877CEEaBDEc52e77a0Df35be9964fC4'

    const result = isAddress(validAddress)

    expect(result).toBe(expectedChecksummedAddress)
  })

  it('returns false if the address is invalid', () => {
    const invalidAddress = '0x123'

    const result = isAddress(invalidAddress)

    expect(result).toBe(false)
  })
})

describe('getContract', () => {
  const validAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
  const invalidAddress = '0x123'
  const ABI = [] as any
  const provider = new JsonRpcProvider()

  it('returns a Contract instance when the address is valid', () => {
    const result = getContract(validAddress, ABI, provider)

    expect(result).toBeInstanceOf(Contract)
  })

  it('returns null when the address is invalid', () => {
    const result = getContract(invalidAddress, ABI, provider)
    expect(result).toBeNull()
  })

  it('returns null when the address is AddressZero', () => {
    const result = getContract(AddressZero, ABI, provider)
    expect(result).toBeNull()
  })
})
