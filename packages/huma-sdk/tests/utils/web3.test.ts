/* eslint-disable jest/no-conditional-expect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { JsonRpcProvider } from '@ethersproject/providers'
import { ChainEnum } from '@huma-finance/shared'

import { getContract, getERC20Contract, isAddress } from '../../src/utils/web3'

describe('isAddress', () => {
  test('should return true if is valid address', () => {
    const result = isAddress('0xF6c0ACD62e69669155f314D6A6E22f5cF63fab4E')
    expect(result).toBeTruthy()
  })

  test('should return false if is not valid address', () => {
    const result = isAddress('0xF6c0ACD62e69669155f314D6A6E22f5cF63fab4Edd')
    expect(result).toBeFalsy()
  })
})

describe('getContract', () => {
  test('should throw error if is not valid address', () => {
    try {
      getContract('invalid address', [], {} as any)
    } catch (error) {
      expect((error as any).message).toBe(
        `Invalid 'address' parameter 'invalid address'.`,
      )
    }
  })

  test('should throw error if is zero', () => {
    try {
      getContract('0x0000000000000000000000000000000000000000', [], {} as any)
    } catch (error) {
      expect((error as any).message).toBe(
        `Invalid 'address' parameter '0x0000000000000000000000000000000000000000'.`,
      )
    }
  })

  test('should return contract', () => {
    const provider = new JsonRpcProvider(`Infura API Key`, {
      name: 'Goerli',
      chainId: ChainEnum.Goerli,
    })
    const signer = provider.getSigner()
    const contract = getContract(
      '0xa2bd28f23a78db41e49db7d7b64b6411123a8b85',
      [],
      signer,
    )
    expect(contract).toBeTruthy()
  })
})

describe('getERC20Contract', () => {
  test('should return ERC20 contract', () => {
    const provider = new JsonRpcProvider(`Infura API Key`, {
      name: 'Goerli',
      chainId: ChainEnum.Goerli,
    })
    const signer = provider.getSigner()
    const contract = getERC20Contract(
      '0xa2bd28f23a78db41e49db7d7b64b6411123a8b85',
      signer,
    )
    expect(contract.approve).toBeTruthy()
  })
})
