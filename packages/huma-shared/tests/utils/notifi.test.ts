/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChainEnum } from '../../src/utils/chain'
import {
  doesChainSupportNotifi,
  getBlockchainConfigFromChain,
} from '../../src/utils/notifi'

describe('getBlockchainConfigFromChain', () => {
  it('returns POLYGON for Polygon and Mumbai chains', () => {
    expect(getBlockchainConfigFromChain(ChainEnum.Polygon)).toBe('POLYGON')
    expect(getBlockchainConfigFromChain(ChainEnum.Mumbai)).toBe('POLYGON')
  })

  it('returns ETHEREUM for Goerli chain', () => {
    expect(getBlockchainConfigFromChain(ChainEnum.Goerli)).toBe('ETHEREUM')
  })

  it('throws an error for an invalid chain', () => {
    expect(() => getBlockchainConfigFromChain(-1 as any)).toThrow(
      'Invalid chain',
    )
  })
})

describe('doesChainSupportNotifi', () => {
  it('returns true for Polygon chain', () => {
    expect(doesChainSupportNotifi(ChainEnum.Polygon, false)).toBe(true)
  })

  it('returns true for Mumbai and Goerli chains in development', () => {
    expect(doesChainSupportNotifi(ChainEnum.Mumbai, true)).toBe(true)
    expect(doesChainSupportNotifi(ChainEnum.Goerli, true)).toBe(true)
  })

  it('returns false for Mumbai and Goerli chains in production', () => {
    const account = '0x0000000000000000000000000000000000000000'

    expect(doesChainSupportNotifi(ChainEnum.Mumbai, false)).toBe(false)
    expect(doesChainSupportNotifi(ChainEnum.Goerli, false)).toBe(false)
  })

  it('returns false for an invalid chain', () => {
    expect(doesChainSupportNotifi(-1 as any, false)).toBe(false)
  })
})
