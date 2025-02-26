/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChainEnum } from '../../src/utils/chain'
import { getBlockchainConfigFromChain } from '../../src/utils/notifi'

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
