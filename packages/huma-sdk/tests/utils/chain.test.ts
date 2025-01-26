import { JsonRpcProvider } from '@ethersproject/providers'
import { ChainEnum } from '@huma-finance/shared'
import { ethers } from 'ethers'

import {
  getChainIdFromJsonSignerOrProvider,
  getChainIdFromSignerOrProvider,
  isPolygonNetwork,
} from '../../src/utils/chain'

describe('isPolygonNetwork', () => {
  test('Should be true if is Polygon network', () => {
    expect(isPolygonNetwork(ChainEnum.Polygon)).toBe(true)
  })

  test('Should be true if is Polygon Mumbai network', () => {
    expect(isPolygonNetwork(ChainEnum.Mumbai)).toBe(true)
  })

  test('Should be false if is not Polygon network', () => {
    expect(isPolygonNetwork(ChainEnum.Goerli)).toBe(false)
  })
})

describe('getChainIdFromJsonSignerOrProvider', () => {
  test('Should return chainId if is JsonRpcProvider', async () => {
    const provider = new JsonRpcProvider(`Infura API Key`, {
      name: 'Goerli',
      chainId: ChainEnum.Goerli,
    })
    expect(await getChainIdFromJsonSignerOrProvider(provider)).toBe(
      ChainEnum.Goerli,
    )
  })

  test('Should return chainId if is JsonRpcSigner', async () => {
    const provider = new JsonRpcProvider(`Infura API Key`, {
      name: 'Goerli',
      chainId: ChainEnum.Goerli,
    })
    const signer = provider.getSigner()
    expect(await getChainIdFromJsonSignerOrProvider(signer)).toBe(
      ChainEnum.Goerli,
    )
  })
})

describe('getChainIdFromSignerOrProvider', () => {
  test('Should return chainId if is ethers Provider', async () => {
    const provider = new ethers.providers.JsonRpcProvider(`Infura API Key`, {
      name: 'Goerli',
      chainId: ChainEnum.Goerli,
    })
    provider.getNetwork = jest.fn().mockResolvedValue({
      chainId: ChainEnum.Goerli,
    })

    expect(await getChainIdFromSignerOrProvider(provider)).toBe(
      ChainEnum.Goerli,
    )
  })

  test('Should return chainId if is ethers Signer', async () => {
    const provider = new ethers.providers.JsonRpcProvider(`Infura API Key`, {
      name: 'Goerli',
      chainId: ChainEnum.Goerli,
    })
    const signer = provider.getSigner()
    signer.provider.getNetwork = jest.fn().mockResolvedValue({
      chainId: ChainEnum.Goerli,
    })

    expect(await getChainIdFromSignerOrProvider(signer)).toBe(ChainEnum.Goerli)
  })
})
